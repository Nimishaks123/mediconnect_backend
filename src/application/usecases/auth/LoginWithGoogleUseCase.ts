import { ILoginWithGoogleUseCase } from "@application/interfaces/auth/ILoginWithGoogleUseCase";
import { LoginWithGoogleDTO } from "@application/dtos/auth/LoginWithGoogleDTO";
import { LoginResponseDTO } from "@application/dtos/auth/LoginDTO";
import { OAuthUserDTO } from "@application/dtos/auth/OAuthUserDTO";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { User } from "@domain/entities/User";
import { ITokenService } from "@application/interfaces/services/ITokenService";
import { IOAuthService } from "@application/interfaces/services/IOAuthService";
import { IRandomGenerator } from "@application/interfaces/services/IRandomGenerator";
import { AuthMapper } from "@application/mappers/AuthMapper";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { Doctor } from "@domain/entities/Doctor";
import { UserRole } from "@domain/enums/UserRole";

export class LoginWithGoogleUseCase implements ILoginWithGoogleUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly tokenService: ITokenService,
    private readonly oauthService: IOAuthService,
    private readonly randomGenerator: IRandomGenerator
  ) {}

  getGoogleAuthUrl(role?: string): string {
    return this.oauthService.getAuthUrl(role);
  }

  async execute(input: LoginWithGoogleDTO): Promise<LoginResponseDTO> {
    const { code, role } = input;

    if (!code) {
      throw new AppError("Missing authorization code", StatusCode.BAD_REQUEST);
    }

    const profile: OAuthUserDTO = await this.oauthService.exchangeCodeForUser(code);

    let user = await this.userRepo.findByEmail(profile.email);

    if (!user) {
      const assignedRole = role === "DOCTOR" || role === "doctor" ? UserRole.DOCTOR : UserRole.PATIENT;
      const randomPassword = this.randomGenerator.generate(16);
      const newUser = User.createOAuthUser(profile.name, profile.email, randomPassword, assignedRole);
      user = await this.userRepo.create(newUser);

      if (assignedRole === UserRole.DOCTOR) {
        const doc = Doctor.startOnboarding(user.id!);
        await this.doctorRepo.createDoctor(doc);
      }
    }

    if (user.blocked) {
      throw new AppError("User is blocked", StatusCode.FORBIDDEN);
    }

    let onboardingStatus;
    if (user.role === UserRole.DOCTOR) {
      const doc = await this.doctorRepo.findByUserId(user.id!);
      onboardingStatus = doc ? doc.onboardingStatus : 'PENDING';
    }

    const payload: any = AuthMapper.toTokenPayload(user);
    if (onboardingStatus) {
      payload.onboardingStatus = onboardingStatus;
    }
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return AuthMapper.toLoginResponse(user, accessToken, refreshToken, onboardingStatus);
  }
}

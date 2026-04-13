import { ILoginUseCase } from "@application/interfaces/auth/ILoginUseCase";
import { LoginDTO, LoginResponseDTO } from "@application/dtos/auth/LoginDTO";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { ITokenService } from "@application/interfaces/services/ITokenService";
import { IPasswordHasher } from "@domain/interfaces/IPasswordHasher";
import { AuthMapper } from "@application/mappers/AuthMapper";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { UserRole } from "@domain/enums/UserRole";

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly tokenService: ITokenService,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(input: LoginDTO): Promise<LoginResponseDTO> {
    const { email, password } = input;

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, StatusCode.BAD_REQUEST);
    }

    const isValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, StatusCode.BAD_REQUEST);
    }

    if (user.blocked) {
      throw new AppError("User is blocked", StatusCode.FORBIDDEN);
    }

    if (!user.isVerified) {
       throw new AppError("User not verified", StatusCode.BAD_REQUEST);
    }

    let onboardingStatus;
    if (user.role === UserRole.DOCTOR) {
      const doc = await this.doctorRepo.findByUserId(user.id!);
      onboardingStatus = doc?.onboardingStatus;
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

import { ILoginWithGoogleUseCase } from "@application/interfaces/auth/ILoginWithGoogleUseCase";
import { LoginWithGoogleDTO } from "@application/dtos/auth/LoginWithGoogleDTO";
import { LoginResponseDTO } from "@application/dtos/auth/LoginDTO";
import { OAuthUserDTO } from "@application/dtos/auth/OAuthUserDTO";

import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { User } from "@domain/entities/User";
import { UserRole } from "@domain/enums/UserRole";

import { TokenService } from "@application/services/TokenService";
import { IOAuthService } from "@application/interfaces/services/IOAuthService";

import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

import crypto from "crypto";

export class LoginWithGoogleUseCase implements ILoginWithGoogleUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly tokenService: TokenService,
    private readonly oauthService: IOAuthService
  ) {}

  getGoogleAuthUrl(): string {
    return this.oauthService.getAuthUrl();
  }

  async execute(input: LoginWithGoogleDTO): Promise<LoginResponseDTO> {
    const { code } = input;

    if (!code) {
      throw new AppError("Missing authorization code", StatusCode.BAD_REQUEST);
    }

    // ✅ UPDATED METHOD NAME
    const profile: OAuthUserDTO =
      await this.oauthService.exchangeCodeForUser(code);

    let user = await this.userRepo.findByEmail(profile.email);

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");

      const newUser = new User(
        profile.name || profile.email.split("@")[0],
        profile.email,
        undefined,
        randomPassword,
        UserRole.PATIENT,
        true,
        false
      );

      user = await this.userRepo.create(newUser);
    }

    if (user.blocked) {
      throw new AppError("User is blocked", StatusCode.FORBIDDEN);
    }

    const payload = {
      id: user.id!,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    return {
      accessToken: this.tokenService.generateAccessToken(payload),
      refreshToken: this.tokenService.generateRefreshToken(payload),
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

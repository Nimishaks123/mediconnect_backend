import { ILoginUseCase } from "../../interfaces/auth/ILoginUseCase";
import { LoginDTO } from "../../dtos/auth/LoginDTO";
import { LoginResponseDTO } from "../../dtos/auth/LoginDTO";

import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { TokenService } from "../../services/TokenService";

import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";

import bcrypt from "bcryptjs";

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: LoginDTO): Promise<LoginResponseDTO> {
    const { email, password } = input;

    //  Find user
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(
        MESSAGES.INVALID_CREDENTIALS,
        StatusCode.BAD_REQUEST
      );
    }

    //  Compare password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(
        MESSAGES.INVALID_CREDENTIALS,
        StatusCode.BAD_REQUEST
      );
    }

    // Additional checks
    if (user.blocked) {
      throw new AppError(
        "User is blocked", 
        StatusCode.FORBIDDEN
      );
    }

    if (!user.isVerified) {
      throw new AppError(
        MESSAGES.OTP_VERIFIED_LOGIN
          ? "User not verified"
          : "User not verified",
        StatusCode.BAD_REQUEST
      );
    }

    // Prepare JWT payload
    const payload = {
      id: user.id!,
      role: user.role,
      email: user.email,
    };

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    //  Return DTO
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

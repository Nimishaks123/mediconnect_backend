import { IRefreshTokenUseCase } from "../../interfaces/auth/IRefreshTokenUseCase";
import { RefreshTokenDTO } from "../../dtos/auth/RefreshTokenDTO";
import { RefreshTokenResponseDTO } from "../../dtos/auth/RefreshTokenResponseDTO";

import { TokenService } from "../../services/TokenService";
import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
import type { JwtPayload } from "../../../common/auth/JwtPayload";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(private readonly tokenService: TokenService) {}

  async execute(input: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
    const { refreshToken } = input;

    // Validate input
    if (!refreshToken) {
      throw new AppError(
        "Refresh token missing",
        StatusCode.BAD_REQUEST
      );
    }

    //  Verify refresh token
    let payload: JwtPayload;

    try {
      payload = this.tokenService.verifyRefreshToken(
        refreshToken
      ) as JwtPayload;
    } catch {
      throw new AppError(
        "Invalid refresh token", 
        StatusCode.UNAUTHORIZED
      );
    }

    // Validate payload
    if (!payload?.id) {
      throw new AppError(
        "Invalid refresh token",
        StatusCode.UNAUTHORIZED
      );
    }

    //  Generate new tokens
    const tokenPayload = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    };

    const newAccessToken =
      this.tokenService.generateAccessToken(tokenPayload);

    const newRefreshToken =
      this.tokenService.generateRefreshToken(tokenPayload);

    //  Return DTO
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

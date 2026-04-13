import { IRefreshTokenUseCase } from "@application/interfaces/auth/IRefreshTokenUseCase";
import { RefreshTokenDTO, RefreshTokenResponseDTO } from "@application/dtos/auth/RefreshTokenDTO";
import { ITokenService } from "@application/interfaces/services/ITokenService";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { JwtPayload } from "@common/auth/JwtPayload";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(private readonly tokenService: ITokenService) {}

  async execute(input: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
    const { refreshToken } = input;

    if (!refreshToken) {
      throw new AppError("Refresh token missing", StatusCode.BAD_REQUEST);
    }

    const payload: JwtPayload = this.tokenService.verifyRefreshToken(refreshToken);

    if (!payload?.id) {
      throw new AppError("Invalid refresh token payload", StatusCode.UNAUTHORIZED);
    }

    const tokenPayload: JwtPayload = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };

    const newAccessToken = this.tokenService.generateAccessToken(tokenPayload);
    const newRefreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

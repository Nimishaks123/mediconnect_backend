import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../../common/auth/JwtPayload";
import { ITokenService } from "../../application/interfaces/services/ITokenService";
import { AppError } from "../../common/AppError";
import { StatusCode } from "../../common/enums";

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly accessSecret: string,
    private readonly accessExpiresIn: string,
    private readonly refreshSecret: string,
    private readonly refreshExpiresIn: string
  ) {}

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(
      {
        id: payload.id,
        role: payload.role,
        email: payload.email,
        name: payload.name,
      },
      this.accessSecret,
      { expiresIn: this.accessExpiresIn } as SignOptions
    );
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(
      {
        id: payload.id,
        role: payload.role,
        email: payload.email,
        name: payload.name,
      },
      this.refreshSecret,
      { expiresIn: this.refreshExpiresIn } as SignOptions
    );
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.accessSecret) as JwtPayload;
    } catch (err) {
      throw new AppError("Invalid or expired access token", StatusCode.UNAUTHORIZED);
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as JwtPayload;
    } catch (err) {
      throw new AppError("Invalid or expired refresh token", StatusCode.UNAUTHORIZED);
    }
  }
}

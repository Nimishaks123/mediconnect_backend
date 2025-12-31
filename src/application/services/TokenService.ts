
import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../dtos/JwtPayload";

export class TokenService {
  constructor(
    private readonly accessSecret: string,
    private readonly accessExpiresIn: string,
    private readonly refreshSecret: string,
    private readonly refreshExpiresIn: string
  ) {}

  // ACCESS TOKEN
  generateAccessToken(payload: JwtPayload) {
    return jwt.sign(
      {
        id: payload.id,       
        role: payload.role,
        email: payload.email,
      },
      this.accessSecret,
      { expiresIn: this.accessExpiresIn } as SignOptions
    );
  }

  // REFRESH TOKEN
  generateRefreshToken(payload: JwtPayload) {
    return jwt.sign(
      {
        id: payload.id,        
        role: payload.role,
        email: payload.email,
      },
      this.refreshSecret,
      { expiresIn: this.refreshExpiresIn } as SignOptions
    );
  }

  // VERIFY TOKENS
  verifyAccessToken(token: string) {
    return jwt.verify(token, this.accessSecret) as JwtPayload;
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshSecret) as JwtPayload;
  }
}

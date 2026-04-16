import { ITokenService, TokenPayload } from "../../application/interfaces/auth/ITokenService";
import { JwtTokenService } from "../services/JwtTokenService";

export class JwtTokenServiceAdapter implements ITokenService {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  verifyAccessToken(token: string): TokenPayload {
    const decoded = this.jwtTokenService.verifyAccessToken(token);
    return {
      id: decoded.id,
      role: decoded.role,
    };
  }
}

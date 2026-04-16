import { ITokenService, TokenPayload } from "../interfaces/auth/ITokenService";
import { AuthenticationError } from "../../presentation/types/AuthenticationError";

export class AuthenticationService {
  constructor(private readonly tokenService: ITokenService) {}

  authenticateToken(token: string): TokenPayload {
    if (!token) {
      throw new AuthenticationError("Unauthorized: No token provided");
    }

    try {
      return this.tokenService.verifyAccessToken(token);
    } catch (error) {
      throw new AuthenticationError("Unauthorized: Invalid token");
    }
  }

  extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Unauthorized: No token provided");
    }

    return authHeader.split(" ")[1];
  }
}

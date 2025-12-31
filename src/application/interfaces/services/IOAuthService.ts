import { OAuthUserDTO } from "../../dtos/auth/OAuthUserDTO";

export interface IOAuthService {
  getAuthUrl(): string;
  exchangeCodeForUser(code: string): Promise<OAuthUserDTO>;
}

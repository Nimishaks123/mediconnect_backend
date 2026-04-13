import { OAuthUserDTO } from "../../dtos/auth/OAuthUserDTO";

export interface IOAuthService {
  getAuthUrl(state?: string): string;
  exchangeCodeForUser(code: string): Promise<OAuthUserDTO>;
}

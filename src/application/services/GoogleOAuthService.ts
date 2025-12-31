import { OAuth2Client } from "google-auth-library";
import { config } from "@common/config";

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
}

export class GoogleOAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri
    );
  }

  getAuthUrl(state?: string) {
    const scopes = [
      "openid",
      "email",
      "profile",
    ];

    const url = this.client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
      state,
    });

    return url;
  }

  async getUserProfile(code: string): Promise<GoogleUserProfile> {
    const { tokens } = await this.client.getToken(code);
    if (!tokens.id_token) {
      throw new Error("Google tokens did not include id_token");
    }

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Google profile missing email");
    }

    return {
      email: payload.email,
      name: payload.name || "",
      picture: payload.picture,
    };
  }
}

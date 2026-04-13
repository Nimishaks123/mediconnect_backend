import axios from "axios";
import querystring from "querystring";
import { IOAuthService } from "@application/interfaces/services/IOAuthService";
import { OAuthUserDTO } from "@application/dtos/auth/OAuthUserDTO";
import { config } from "@common/config";

export class GoogleOAuthService implements IOAuthService {

  getAuthUrl(state?: string): string {
    const paramsOptions: any = {
      client_id: config.googleClientId,
      redirect_uri: config.googleRedirectUri,
      response_type: "code",
      scope: [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),
      access_type: "offline",
      prompt: "consent",
    };

    if (state) {
      paramsOptions.state = state;
    }

    const params = querystring.stringify(paramsOptions);

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async exchangeCodeForUser(code: string): Promise<OAuthUserDTO> {
    // 1️⃣ Exchange code for token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        code,
        client_id: config.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: config.googleRedirectUri,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenRes.data;

    // 2️⃣ Fetch Google profile
    const profileRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const profile = profileRes.data;

    return {
      email: profile.email,
      name: profile.name,          // ✅ REAL NAME
      providerId: profile.sub,     // Google unique ID
    };
  }
}

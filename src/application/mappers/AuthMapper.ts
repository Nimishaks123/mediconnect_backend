import { User } from "@domain/entities/User";
import { LoginResponseDTO } from "../dtos/auth/LoginDTO";
import { MESSAGES } from "@common/constants";

export class AuthMapper {
  static toTokenPayload(user: User) {
    return {
      id:user.getId(),
      role: user.getRole(),
      email: user.getEmail(),
    };
  }

  static toLoginResponse(user: User, accessToken: string, refreshToken: string, onboardingStatus?: string): LoginResponseDTO {
    return {
      accessToken,
      refreshToken,
      user: {
      id:user.getId(),
        name: user.getName(),
       email: user.getEmail(),
          role: user.getRole(),
        onboardingStatus,
      },
    };
  }

  static toVerifyOtpResponse(user: User, onboardingStatus?: string) {
    return {
      success: true,
      message: MESSAGES.OTP_VERIFIED_LOGIN,
      user: {
        id: user.getId()!,
        name: user.getName(),
        email: user.getEmail(),
        role: user.getRole(),
        onboardingStatus,
      },
    };
  }
}

import { User } from "@domain/entities/User";
import { LoginResponseDTO } from "../dtos/auth/LoginDTO";
import { MESSAGES } from "@common/constants";

export class AuthMapper {
  static toTokenPayload(user: User) {
    return {
      id: user.id!,
      role: user.role,
      email: user.email,
    };
  }

  static toLoginResponse(user: User, accessToken: string, refreshToken: string, onboardingStatus?: string): LoginResponseDTO {
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingStatus,
      },
    };
  }

  static toVerifyOtpResponse(user: User, onboardingStatus?: string) {
    return {
      success: true,
      message: MESSAGES.OTP_VERIFIED_LOGIN,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingStatus,
      },
    };
  }
}

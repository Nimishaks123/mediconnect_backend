import { Request } from "express";
import { SignupUserDTO } from "@application/dtos/auth/SignupUserDTO";
import { LoginDTO } from "@application/dtos/auth/LoginDTO";
import { VerifyOtpDTO } from "@application/dtos/auth/VerifyOtpDTO";
import { ResendOtpDTO } from "@application/dtos/auth/ResendOtpDTO";
import { LoginWithGoogleDTO } from "@application/dtos/auth/LoginWithGoogleDTO";
import { RefreshTokenDTO } from "@application/dtos/auth/RefreshTokenDTO";
import { SendForgotPasswordOtpDTO } from "@application/dtos/auth/SendForgotPasswordOtpDTO";
import { VerifyForgotPasswordOtpDTO } from "@application/dtos/auth/VerifyForgotPasswordOtpDTO";
import { ResetPasswordDTO } from "@application/dtos/auth/ResetPasswordDTO";

export class AuthMapper {
  static toSignupDTO(req: Request): SignupUserDTO {
    return {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber || req.body.phone,
      password: req.body.password,
      role: req.body.role,
    };
  }

  static toLoginDTO(req: Request): LoginDTO {
    return {
      email: req.body.email,
      password: req.body.password,
    };
  }

  static toVerifyOtpDTO(req: Request): VerifyOtpDTO {
    return {
      email: req.body.email,
      code: req.body.code || req.body.otp,
    };
  }

  static toResendOtpDTO(req: Request): ResendOtpDTO {
    return {
      email: req.body.email,
    };
  }

  static toLoginWithGoogleDTO(req: Request): LoginWithGoogleDTO {
    return {
      code: req.query.code as string,
      role: req.query.state as string,
    };
  }

  static toRefreshTokenDTO(req: Request): RefreshTokenDTO {
    return {
      refreshToken: req.cookies.refreshToken,
    };
  }

  static toSendForgotPasswordOtpDTO(req: Request): SendForgotPasswordOtpDTO {
    return {
      email: req.body.email,
    };
  }

  static toVerifyForgotPasswordOtpDTO(req: Request): VerifyForgotPasswordOtpDTO {
    return {
      email: req.body.email,
      code: req.body.code || req.body.otp,
    };
  }

  static toResetPasswordDTO(req: Request): ResetPasswordDTO {
    return {
      email: req.body.email,
      newPassword: req.body.newPassword || req.body.password,
    };
  }
}

import { Request, Response, NextFunction } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { config } from "@common/config";

import {
  ISignupUserUseCase,
  IVerifyOtpUseCase,
  IResendOtpUseCase,
  ILoginUseCase,
  IRefreshTokenUseCase,
  ISendForgotPasswordOtpUseCase,
  IVerifyForgotPasswordOtpUseCase,
  IResetPasswordUseCase,
  ILoginWithGoogleUseCase,
} from "@application/interfaces/auth";

import {
  SignupUserDTO,
} from "@application/dtos/auth/SignupUserDTO";
import {
  VerifyOtpDTO,
} from "@application/dtos/auth/VerifyOtpDTO";
import {
  LoginDTO,
} from "@application/dtos/auth/LoginDTO";
import {
  RefreshTokenDTO,
} from "@application/dtos/auth/RefreshTokenDTO";
import {
  SendForgotPasswordOtpDTO,
} from "@application/dtos/auth/SendForgotPasswordOtpDTO";
import {
  VerifyForgotPasswordOtpDTO,
} from "@application/dtos/auth/VerifyForgotPasswordOtpDTO";
import {
  ResetPasswordDTO,
} from "@application/dtos/auth/ResetPasswordDTO";
import {
  ResendOtpDTO,
} from "@application/dtos/auth/ResendOtpDTO";
import {
  LoginWithGoogleDTO,
} from "@application/dtos/auth/LoginWithGoogleDTO";

export class AuthController {
  constructor(
    private readonly signupUserUseCase: ISignupUserUseCase,
    private readonly verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly resendOtpUseCase: IResendOtpUseCase,
    private readonly loginUseCase: ILoginUseCase,
    private readonly refreshTokenUseCase: IRefreshTokenUseCase,
    private readonly sendForgotPasswordOtpUseCase: ISendForgotPasswordOtpUseCase,
    private readonly verifyForgotPasswordOtpUseCase: IVerifyForgotPasswordOtpUseCase,
    private readonly resetPasswordUseCase: IResetPasswordUseCase,
    private readonly loginWithGoogleUseCase: ILoginWithGoogleUseCase
  ) {}

  // =========================
  // GOOGLE AUTH URL
  // =========================
  googleAuthUrl = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    const redirectUrl =
      this.loginWithGoogleUseCase.getGoogleAuthUrl();
    res.redirect(redirectUrl);
  };

  // =========================
  // GOOGLE CALLBACK
  // =========================
  googleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: LoginWithGoogleDTO = {
        code: req.query.code as string,
      };

      const result =
        await this.loginWithGoogleUseCase.execute(dto);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      logger.info("Google login successful");

      res.redirect(
        `${config.frontendBaseUrl}/oauth-success?token=${result.accessToken}`
      );
    } catch (error) {
      logger.error("Google OAuth callback failed");
      next(error);
    }
  };

  // =========================
  // SIGNUP
  // =========================
  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: SignupUserDTO = req.body;

      const result =
        await this.signupUserUseCase.execute(dto);

      logger.info("User signup successful", { email: dto.email });

      res.status(StatusCode.CREATED).json(result);
    } catch (error) {
      logger.error("Signup failed");
      next(error);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: ResendOtpDTO = req.body;

      const result =
        await this.resendOtpUseCase.execute(dto);

      logger.info("OTP resent", { email: dto.email });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Resend OTP failed");
      next(error);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: VerifyOtpDTO = req.body;

      const result =
        await this.verifyOtpUseCase.execute(dto);

      logger.info("OTP verified", { email: dto.email });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("OTP verification failed");
      next(error);
    }
  };

  // =========================
  // LOGIN
  // =========================
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: LoginDTO = req.body;

      const result =
        await this.loginUseCase.execute(dto);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      logger.info("User login successful", { email: dto.email });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Login failed");
      next(error);
    }
  };

  // =========================
  // REFRESH TOKEN
  // =========================
  refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: RefreshTokenDTO = {
        refreshToken: req.cookies.refreshToken,
      };

      const result =
        await this.refreshTokenUseCase.execute(dto);

      if (result.refreshToken) {
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: config.isProduction,
          sameSite: "strict",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      logger.info("Access token refreshed");

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Token refresh failed");
      next(error);
    }
  };

  // =========================
  // FORGOT PASSWORD – SEND OTP
  // =========================
  sendForgotPasswordOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: SendForgotPasswordOtpDTO = req.body;

      const result =
        await this.sendForgotPasswordOtpUseCase.execute(dto);

      logger.info("Forgot password OTP sent", { email: dto.email });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Send forgot password OTP failed");
      next(error);
    }
  };

  // =========================
  // FORGOT PASSWORD – VERIFY OTP
  // =========================
  verifyForgotPasswordOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: VerifyForgotPasswordOtpDTO = req.body;

      const result =
        await this.verifyForgotPasswordOtpUseCase.execute(dto);

      logger.info("Forgot password OTP verified", { email: dto.email });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Verify forgot password OTP failed");
      next(error);
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================
  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto: ResetPasswordDTO = req.body;

      const result =
        await this.resetPasswordUseCase.execute(dto);

      logger.info("Password reset successful", { email: dto.email });

      res.status(StatusCode.OK).json(result);
    } catch (error) {
      logger.error("Password reset failed");
      next(error);
    }
  };
}

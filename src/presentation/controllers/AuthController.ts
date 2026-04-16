import { Request, Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { config } from "@common/config";
import { catchAsync } from "@presentation/utils/catchAsync";
import { 
  SignupSchema,
  LoginSchema,
  VerifyOtpSchema,
  ResendOtpSchema,
  LoginWithGoogleSchema,
  RefreshTokenSchema,
  SendForgotPasswordOtpSchema,
  VerifyForgotPasswordOtpSchema,
  ResetPasswordSchema
} from "../validators/auth.validator";

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

  googleAuthUrl = catchAsync(async (req: Request, res: Response) => {
    const role = req.query.role as string | undefined;
    const redirectUrl = this.loginWithGoogleUseCase.getGoogleAuthUrl(role);
    res.redirect(redirectUrl);
  });
  
  googleCallback = catchAsync(async (req: Request, res: Response) => {
    const validated = LoginWithGoogleSchema.parse(req.query);
    const result = await this.loginWithGoogleUseCase.execute(validated);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info("Google login successful");
    res.redirect(`${config.frontendUrl}/oauth-success?token=${result.accessToken}`);
  });

  signup = catchAsync(async (req: Request, res: Response) => {
    const validated = SignupSchema.parse(req.body);
    const result = await this.signupUserUseCase.execute(validated);

    logger.info("User signup successful", { email: validated.email });
    res.status(StatusCode.CREATED).json(result);
  });

  resendOtp = catchAsync(async (req: Request, res: Response) => {
    const validated = ResendOtpSchema.parse(req.body);
    const result = await this.resendOtpUseCase.execute(validated);

    logger.info("OTP resent", { email: validated.email });
    res.status(StatusCode.OK).json(result);
  });

  verifyOtp = catchAsync(async (req: Request, res: Response) => {
    const validated = VerifyOtpSchema.parse(req.body);
    const result = await this.verifyOtpUseCase.execute(validated);

    logger.info("OTP verified", { email: validated.email });
    res.status(StatusCode.OK).json(result);
  });
  
  login = catchAsync(async (req: Request, res: Response) => {
    const validated = LoginSchema.parse(req.body);
    const result = await this.loginUseCase.execute(validated);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info("User login successful", { email: validated.email });
    res.status(StatusCode.OK).json(result);
  });

  refresh = catchAsync(async (req: Request, res: Response) => {
    const validated = RefreshTokenSchema.parse(req.cookies);
    const result = await this.refreshTokenUseCase.execute(validated);

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
  });

  sendForgotPasswordOtp = catchAsync(async (req: Request, res: Response) => {
    const validated = SendForgotPasswordOtpSchema.parse(req.body);
    const result = await this.sendForgotPasswordOtpUseCase.execute(validated);

    logger.info("Forgot password OTP sent", { email: validated.email });
    res.status(StatusCode.OK).json(result);
  });

  verifyForgotPasswordOtp = catchAsync(async (req: Request, res: Response) => {
    const validated = VerifyForgotPasswordOtpSchema.parse(req.body);
    const result = await this.verifyForgotPasswordOtpUseCase.execute(validated);

    logger.info("Forgot password OTP verified", { email: validated.email });
    res.status(StatusCode.OK).json(result);
  });

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const validated = ResetPasswordSchema.parse(req.body);
    const result = await this.resetPasswordUseCase.execute(validated);

    logger.info("Password reset successful", { email: validated.email });
    res.status(StatusCode.OK).json(result);
  });
}

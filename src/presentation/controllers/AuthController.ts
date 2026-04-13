import { Request, Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { config } from "@common/config";
import { catchAsync } from "@presentation/utils/catchAsync";
import { AuthMapper } from "../mappers/auth/AuthMapper";

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
    const dto = AuthMapper.toLoginWithGoogleDTO(req);
    const result = await this.loginWithGoogleUseCase.execute(dto);

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
    const dto = AuthMapper.toSignupDTO(req);
    const result = await this.signupUserUseCase.execute(dto);

    logger.info("User signup successful", { email: dto.email });
    res.status(StatusCode.CREATED).json(result);
  });

  resendOtp = catchAsync(async (req: Request, res: Response) => {
    const dto = AuthMapper.toResendOtpDTO(req);
    const result = await this.resendOtpUseCase.execute(dto);

    logger.info("OTP resent", { email: dto.email });
    res.status(StatusCode.OK).json(result);
  });

  verifyOtp = catchAsync(async (req: Request, res: Response) => {
    const dto = AuthMapper.toVerifyOtpDTO(req);
    const result = await this.verifyOtpUseCase.execute(dto);

    logger.info("OTP verified", { email: dto.email });
    res.status(StatusCode.OK).json(result);
  });
  
  login = catchAsync(async (req: Request, res: Response) => {
    const dto = AuthMapper.toLoginDTO(req);
    const result = await this.loginUseCase.execute(dto);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info("User login successful", { email: dto.email });
    res.status(StatusCode.OK).json(result);
  });

  refresh = catchAsync(async (req: Request, res: Response) => {
    const dto = AuthMapper.toRefreshTokenDTO(req);
    const result = await this.refreshTokenUseCase.execute(dto);

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
    const dto = AuthMapper.toSendForgotPasswordOtpDTO(req);
    const result = await this.sendForgotPasswordOtpUseCase.execute(dto);

    logger.info("Forgot password OTP sent", { email: dto.email });
    res.status(StatusCode.OK).json(result);
  });

  verifyForgotPasswordOtp = catchAsync(async (req: Request, res: Response) => {
    const dto = AuthMapper.toVerifyForgotPasswordOtpDTO(req);
    const result = await this.verifyForgotPasswordOtpUseCase.execute(dto);

    logger.info("Forgot password OTP verified", { email: dto.email });
    res.status(StatusCode.OK).json(result);
  });

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const dto = AuthMapper.toResetPasswordDTO(req);
    const result = await this.resetPasswordUseCase.execute(dto);

    logger.info("Password reset successful", { email: dto.email });
    res.status(StatusCode.OK).json(result);
  });
}

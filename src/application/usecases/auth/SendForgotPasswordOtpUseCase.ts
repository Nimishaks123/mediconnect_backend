import { ISendForgotPasswordOtpUseCase } from "../../interfaces/auth/ISendForgotPasswordOtpUseCase";
import { SendForgotPasswordOtpDTO } from "../../dtos/auth/SendForgotPasswordOtpDTO";
import { SendForgotPasswordOtpResponseDTO } from "../../dtos/auth/SendForgotPasswordOtpDTO";

import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IMailer } from "../../../domain/interfaces/IMailer";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { Otp } from "../../../domain/entities/Otp";
import {config} from "../../../common/config";
import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
import bcrypt from "bcryptjs"
import logger from "../../../common/logger"

export class SendForgotPasswordOtpUseCase
  implements ISendForgotPasswordOtpUseCase
{
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpRepo: IOtpRepository,
    private readonly mailer: IMailer,
    private readonly expiryMin: number = 5
  ) {}

  async execute(
    input: SendForgotPasswordOtpDTO
  ): Promise<SendForgotPasswordOtpResponseDTO> {
    const { email } = input;

    //  Validate input
    if (!email) {
      throw new AppError(
        MESSAGES.EMAIL_REQUIRED ?? "Email is required",
        StatusCode.BAD_REQUEST
      );
    }

    //  Ensure user exists
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(
        MESSAGES.USER_NOT_FOUND,
        StatusCode.NOT_FOUND
      );
    }

    //  Remove previous OTPs (policy decision)
    await this.otpRepo.deleteByEmail(email);

    //  Generate OTP
    const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashOtp= await bcrypt.hash(plainOtp,10)

    const otp = new Otp(
      email,
      hashOtp,
      new Date(Date.now() + this.expiryMin * 60 * 1000), // expiresAt
      new Date(),                                       // createdAt
      0,                                                // attempts
      undefined,                                        // id
      "FORGOT_PASSWORD",                                // context
      false                                             // verified
    );

    await this.otpRepo.create(otp);

    //  Send OTP email
    try {
      await this.mailer.sendOtp(email,plainOtp);
    } catch (err) {
      throw new AppError(
        MESSAGES.OTP_EMAIL_SEND_FAILED ?? "Failed to send OTP email",
        StatusCode.INTERNAL_ERROR
      );
    }
    if (config.nodeEnv!== "production") {
  logger.info(`Forgot Password OTP for ${email}: ${plainOtp}`);
}

    // Return response DTO
    return {
      message: MESSAGES.OTP_SENT_FOR_PASSWORD_RESET ?? "OTP sent to email",
    };
  }
}

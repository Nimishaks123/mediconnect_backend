import { IResendOtpUseCase } from "../../interfaces/auth/IResendOtpUseCase";
import { ResendOtpDTO } from "../../dtos/auth/ResendOtpDTO";
import { ResendOtpResponseDTO } from "../../dtos/auth/ResendOtpDTO";

import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IMailer } from "../../../domain/interfaces/IMailer";
import { Otp } from "../../../domain/entities/Otp";

import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
import {config} from "../../../common/config"

import bcrypt from "bcryptjs";
import logger from "@common/logger";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly mailer: IMailer,
    private readonly otpExpiryMin: number = 5
  ) {}

  async execute(input: ResendOtpDTO): Promise<ResendOtpResponseDTO> {
    const { email } = input;

    //  Validate input
    if (!email) {
      throw new AppError(
        MESSAGES.EMAIL_REQUIRED ?? "Email is required",
        StatusCode.BAD_REQUEST
      );
    }

    //  Delete previous OTPs
    await this.otpRepo.deleteByEmail(email);

    //  Generate plain OTP
    const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();

    //  Hash OTP
    const hashedOtp = await bcrypt.hash(plainOtp, 10);

    const expiresAt = new Date(
      Date.now() + this.otpExpiryMin * 60 * 1000
    );

    //  Store hashed OTP
    const otp = new Otp(email, hashedOtp, expiresAt);
    await this.otpRepo.create(otp);

    //  DEV ONLY logging
    if (config.nodeEnv!== "production") {
      logger.info(`Resend OTP for ${email}: ${plainOtp}`);
    }

    //  Send plain OTP via email
    try {
      await this.mailer.sendOtp(email, plainOtp);
    } catch {
      throw new AppError(
        MESSAGES.OTP_EMAIL_SEND_FAILED ?? "Failed to send OTP email",
        StatusCode.INTERNAL_ERROR
      );
    }

    return {
      success: true,
      message: MESSAGES.OTP_RESENT,
      email,
    };
  }
}

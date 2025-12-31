import { ISignupUserUseCase } from "../../interfaces/auth/ISignupUserUseCase";
import { SignupUserDTO } from "../../dtos/auth/SignupUserDTO";
import { SignupUserResponseDTO } from "../../dtos/auth/SignupUserDTO";

import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IMailer } from "../../../domain/interfaces/IMailer";

import { User } from "../../../domain/entities/User";
import { Otp } from "../../../domain/entities/Otp";

import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
import logger from "../../../common/logger";

import bcrypt from "bcryptjs";

export class SignupUserUseCase implements ISignupUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpRepo: IOtpRepository,
    private readonly mailer: IMailer,
    private readonly otpExpiryMin: number = 5
  ) {}

  async execute(input: SignupUserDTO): Promise<SignupUserResponseDTO> {
    const { name, email, phoneNumber, password, role } = input;

    //  Validate input
    if (!name || !email || !password) {
      throw new AppError(
        MESSAGES.SIGNUP_INPUT_INVALID ?? "Name, email and password are required",
        StatusCode.BAD_REQUEST
      );
    }

    //  Check if user already exists
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new AppError(
        MESSAGES.EMAIL_ALREADY_REGISTERED,
        StatusCode.CONFLICT
      );
    }

    //  Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //  Create domain user (unverified by default)
    const user = new User(
      name,
      email,
      phoneNumber,
      passwordHash,
      role ?? "PATIENT",
      false, // isVerified
      false  // blocked
    );

    const createdUser = await this.userRepo.create(user);

    //  Generate OTP
    const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash=await bcrypt.hash(plainOtp,10);

    const otp = new Otp(
      email,
      otpHash,
      new Date(Date.now() + this.otpExpiryMin * 60 * 1000) // expiresAt
    );

    await this.otpRepo.create(otp);
    if (process.env.NODE_ENV !== "production") {
  logger.info(`Signup OTP for ${email}: ${plainOtp}`);
}

    //  Send OTP email
    try {
      await this.mailer.sendOtp(email, plainOtp);
    } catch (err) {
      throw new AppError(
        MESSAGES.OTP_EMAIL_SEND_FAILED ?? "Failed to send OTP email",
        StatusCode.INTERNAL_ERROR
      );
    }

    //  Return response DTO
    return {
      success: true,
      message: MESSAGES.USER_CREATED_OTP_SENT,
      userId: createdUser.id!,
      email: createdUser.email,
    };
  }
}

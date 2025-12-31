import { IVerifyOtpUseCase } from "../../interfaces/auth/IVerifyOtpUseCase";
import { VerifyOtpDTO } from "../../dtos/auth/VerifyOtpDTO";
import { VerifyOtpResponseDTO } from "../../dtos/auth/VerifyOtpDTO";

import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";

import bcrypt from "bcryptjs";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(input: VerifyOtpDTO): Promise<VerifyOtpResponseDTO> {
    const { email, code } = input;

    // 1️⃣ Validate input
    if (!email || !code) {
      throw new AppError(MESSAGES.OTP_INVALID, StatusCode.BAD_REQUEST);
    }

    // 2️⃣ Fetch latest OTP
    const otp = await this.otpRepo.findLatestByEmail(email,"SIGNUP");
    if (!otp) {
      throw new AppError(MESSAGES.OTP_INVALID, StatusCode.NOT_FOUND);
    }

    // 3️⃣ Check expiry
    if (otp.isExpired()) {
      throw new AppError(MESSAGES.OTP_EXPIRED, StatusCode.BAD_REQUEST);
    }

    // 4️⃣ Compare OTP securely
    const isValid = await bcrypt.compare(code, otp.code);

    if (!isValid) {
      if (otp.id && this.otpRepo.incrementAttempts) {
        await this.otpRepo.incrementAttempts(otp.id);
      }

      throw new AppError(MESSAGES.OTP_INVALID, StatusCode.BAD_REQUEST);
    }

    // 5️⃣ Find user
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    // 6️⃣ Mark user as verified
    user.verify();
    await this.userRepo.updateById(user.id!, { isVerified: true });

    // 7️⃣ Cleanup OTP
    await this.otpRepo.deleteByEmail(email);

    // 8️⃣ Return response
    return {
      success: true,
      message: MESSAGES.OTP_VERIFIED_LOGIN,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

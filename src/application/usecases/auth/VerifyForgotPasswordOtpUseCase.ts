import { IVerifyForgotPasswordOtpUseCase } from "../../interfaces/auth/IVerifyForgotPasswordOtpUseCase";
import { VerifyForgotPasswordOtpDTO } from "../../dtos/auth/VerifyForgotPasswordOtpDTO";
import { VerifyForgotPasswordOtpResponseDTO } from "../../dtos/auth/VerifyForgotPasswordOtpDTO";
import bcrypt from "bcryptjs";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";

export class VerifyForgotPasswordOtpUseCase
  implements IVerifyForgotPasswordOtpUseCase
{
  constructor(private readonly otpRepo: IOtpRepository) {}

  async execute(
    input: VerifyForgotPasswordOtpDTO
  ): Promise<VerifyForgotPasswordOtpResponseDTO> {
    const { email, code } = input;

    // Validate input
    if (!email || !code) {
      throw new AppError(
        MESSAGES.OTP_INVALID,
        StatusCode.BAD_REQUEST
      );
    }

    // Fetch latest OTP
    const record = await this.otpRepo.findLatestByEmail(email,"FORGOT_PASSWORD");
    if (!record) {
      throw new AppError(
        MESSAGES.OTP_INVALID,
        StatusCode.NOT_FOUND
      );
    }

    // Check expiry
    if (record.isExpired()) {
      throw new AppError(
        MESSAGES.OTP_EXPIRED,
        StatusCode.BAD_REQUEST
      );
    }

    //  Validate OTP code
    // if (record.code !== code) {
    //   await this.otpRepo.incrementAttempts(record.id!);

    //   throw new AppError(
    //     MESSAGES.OTP_INVALID,
    //     StatusCode.BAD_REQUEST
    //   );
    // }
    const isMatch=await bcrypt.compare(code,record.code);
    if(!isMatch){
      if(record.id){
        await this.otpRepo.incrementAttempts(record.id);
      }
      throw new AppError(
        MESSAGES.OTP_INVALID,
        StatusCode.BAD_REQUEST
      );
    }

  //  Return response DTO
    return {
      message: MESSAGES.OTP_VERIFIED_LOGIN ?? "OTP verified",
    };
  }
}

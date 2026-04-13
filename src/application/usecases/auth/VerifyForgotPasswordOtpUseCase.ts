import { IVerifyForgotPasswordOtpUseCase } from "@application/interfaces/auth/IVerifyForgotPasswordOtpUseCase";
import { VerifyForgotPasswordOtpDTO, VerifyForgotPasswordOtpResponseDTO } from "@application/dtos/auth/VerifyForgotPasswordOtpDTO";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import { ICodeVerifier } from "@domain/interfaces/ICodeVerifier";
import { OtpCode } from "@domain/value-objects/OtpCode";
import { OtpContext } from "@domain/entities/Otp";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";

export class VerifyForgotPasswordOtpUseCase implements IVerifyForgotPasswordOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly codeVerifier: ICodeVerifier
  ) {}

  async execute(input: VerifyForgotPasswordOtpDTO): Promise<VerifyForgotPasswordOtpResponseDTO> {
    const { email, code: rawCode } = input;

    const providedCode = new OtpCode(rawCode);

    const otp = await this.otpRepo.findLatestByEmail(email, OtpContext.FORGOT_PASSWORD);

    if (!otp) {
      throw new AppError(MESSAGES.OTP_INVALID, StatusCode.NOT_FOUND);
    }

    await otp.verify(providedCode, this.codeVerifier);
    
    otp.consume();
    
    await this.otpRepo.save(otp);

    return {
      message: MESSAGES.OTP_VERIFIED_LOGIN ?? "OTP verified successfully",
    };
  }
}

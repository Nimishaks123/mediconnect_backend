import { VerifyForgotPasswordOtpDTO } from "../../dtos/auth/VerifyForgotPasswordOtpDTO";
import { VerifyForgotPasswordOtpResponseDTO } from "../../dtos/auth/VerifyForgotPasswordOtpResponseDTO";

export interface IVerifyForgotPasswordOtpUseCase {
  execute(input: VerifyForgotPasswordOtpDTO): Promise<VerifyForgotPasswordOtpResponseDTO>;
}

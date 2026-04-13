import { VerifyForgotPasswordOtpDTO } from "../../dtos/auth/VerifyForgotPasswordOtpDTO";
import { VerifyForgotPasswordOtpResponseDTO } from "../../dtos/auth/VerifyForgotPasswordOtpDTO";

export interface IVerifyForgotPasswordOtpUseCase {
  execute(input: VerifyForgotPasswordOtpDTO): Promise<VerifyForgotPasswordOtpResponseDTO>;
}

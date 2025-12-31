import { SendForgotPasswordOtpDTO } from "../../dtos/auth/SendForgotPasswordOtpDTO";
import { SendForgotPasswordOtpResponseDTO } from "../../dtos/auth/SendForgotPasswordOtpResponseDTO";

export interface ISendForgotPasswordOtpUseCase {
  execute(input: SendForgotPasswordOtpDTO): Promise<SendForgotPasswordOtpResponseDTO>;
}

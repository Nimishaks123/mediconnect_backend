import { SendForgotPasswordOtpDTO } from "../../dtos/auth/SendForgotPasswordOtpDTO";
import { SendForgotPasswordOtpResponseDTO } from "../../dtos/auth/SendForgotPasswordOtpDTO";

export interface ISendForgotPasswordOtpUseCase {
  execute(input: SendForgotPasswordOtpDTO): Promise<SendForgotPasswordOtpResponseDTO>;
}

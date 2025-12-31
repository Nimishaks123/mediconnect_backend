import { ResendOtpDTO } from "../../dtos/auth/ResendOtpDTO";
import { ResendOtpResponseDTO } from "../../dtos/auth/ResendOtpResponseDTO";

export interface IResendOtpUseCase {
  execute(input: ResendOtpDTO): Promise<ResendOtpResponseDTO>;
}

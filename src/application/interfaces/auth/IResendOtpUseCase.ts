import { ResendOtpDTO } from "../../dtos/auth/ResendOtpDTO";
import { ResendOtpResponseDTO } from "../../dtos/auth/ResendOtpDTO";

export interface IResendOtpUseCase {
  execute(input: ResendOtpDTO): Promise<ResendOtpResponseDTO>;
}

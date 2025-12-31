import { VerifyOtpDTO } from "../../dtos/auth/VerifyOtpDTO";
import { VerifyOtpResponseDTO } from "../../dtos/auth/VerifyOtpResponseDTO";

export interface IVerifyOtpUseCase {
  execute(input: VerifyOtpDTO): Promise<VerifyOtpResponseDTO>;
}

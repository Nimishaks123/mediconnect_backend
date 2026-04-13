import { VerifyOtpDTO } from "../../dtos/auth/VerifyOtpDTO";
import { VerifyOtpResponseDTO } from "../../dtos/auth/VerifyOtpDTO";

export interface IVerifyOtpUseCase {
  execute(input: VerifyOtpDTO): Promise<VerifyOtpResponseDTO>;
}

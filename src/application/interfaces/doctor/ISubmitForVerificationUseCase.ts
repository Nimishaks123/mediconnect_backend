import { SubmitForVerificationDTO } from "../../dtos/doctor/SubmitForVerificationDTO";
import { SubmitForVerificationResponseDTO } from "../../dtos/doctor/SubmitForVerificationResponseDTO";

export interface ISubmitForVerificationUseCase {
  execute(input: SubmitForVerificationDTO): Promise<SubmitForVerificationResponseDTO>;
}

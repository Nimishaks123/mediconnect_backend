import { SubmitForVerificationDTO } from "../../dtos/doctor/SubmitForVerificationDTO";
import { SubmitForVerificationResponseDTO } from "../../dtos/doctor/SubmitForVerificationDTO";

export interface ISubmitForVerificationUseCase {
  execute(input: SubmitForVerificationDTO): Promise<SubmitForVerificationResponseDTO>;
}

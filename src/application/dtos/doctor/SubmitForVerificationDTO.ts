export interface SubmitForVerificationDTO {
  userId: string;
}
import { DoctorResponseDTO } from "./DoctorResponseDTO";

export interface SubmitForVerificationResponseDTO {
  doctor: DoctorResponseDTO;
  message: string;
}


export interface StartDoctorOnboardingDTO {
  userId: string;
}
import { DoctorResponseDTO } from "./DoctorResponseDTO";

export interface StartDoctorOnboardingResponseDTO {
  doctor: DoctorResponseDTO;
  message: string;
}

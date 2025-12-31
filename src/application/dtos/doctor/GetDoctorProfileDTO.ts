export interface GetDoctorProfileDTO {
  userId: string;
}
import { DoctorResponseDTO } from "./DoctorResponseDTO";

export interface GetDoctorProfileResponseDTO {
   doctor: DoctorResponseDTO | null;
  message?: string;
}

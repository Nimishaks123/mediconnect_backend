export interface CreateDoctorProfileDTO {
  userId: string;
  specialty: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  registrationNumber: string;
  aboutMe: string;
}
import { DoctorResponseDTO } from "./DoctorResponseDTO";

export interface CreateDoctorProfileResponseDTO {
 doctor: DoctorResponseDTO;
  message: string;
}


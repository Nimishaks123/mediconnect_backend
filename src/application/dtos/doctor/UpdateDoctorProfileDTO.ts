export interface UpdateDoctorProfileDTO {
  userId: string;
  updates: Partial<{
    specialty: string;
    qualification: string;
    experience: number;
    consultationFee: number;
    registrationNumber: string;
    aboutMe: string;
    profilePhoto: string;
    licenseDocument: string;
    certifications: string[];
  }>;
}
import { DoctorResponseDTO } from "./DoctorResponseDTO";

export interface UpdateDoctorProfileResponseDTO {
  doctor: DoctorResponseDTO;
  message: string;
}

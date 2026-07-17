export interface UpdateDoctorProfileDTO {
  userId: string;
  updates: Partial<{
    name: string;
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
  user: {
    id: string;
    name: string;
  };
  message: string;
}

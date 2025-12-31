export interface UploadDoctorDocumentsDTO {
  userId: string;
  files: any; 
}
import { DoctorResponseDTO } from "./DoctorResponseDTO";

export interface UploadDoctorDocumentsResponseDTO {
 doctor: DoctorResponseDTO;
  message: string;
}


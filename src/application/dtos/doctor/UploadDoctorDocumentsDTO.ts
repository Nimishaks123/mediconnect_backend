export interface UploadDoctorDocumentsDTO {
  userId: string;
  files: {
    licenseDocument?: Express.Multer.File[];
    certifications?: Express.Multer.File[];
  };
  profilePhotoUrl?: string;
}
import { Doctor } from "@domain/entities/Doctor";

export interface UploadDoctorDocumentsResponseDTO {
 doctor: Doctor;
  message: string;
}


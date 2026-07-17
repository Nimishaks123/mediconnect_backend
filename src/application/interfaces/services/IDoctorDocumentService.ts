export interface DoctorUploadFilesDTO {
  licenseDocument?: Express.Multer.File[];
  profilePhoto?: Express.Multer.File[];
  certifications?: Express.Multer.File[];
}

export interface DoctorUploadResults {
  licenseDocument?: string;
  profilePhoto?: string;
  certifications?: string[];
}

export interface IDoctorDocumentService {

  uploadAll(files: DoctorUploadFilesDTO): Promise<DoctorUploadResults>;
}

export interface DoctorUploadFilesDTO {
  licenseDocument?: { buffer: Buffer }[];
  profilePhoto?: { buffer: Buffer }[];
  certifications?: { buffer: Buffer }[];
}

export interface DoctorUploadResults {
  licenseDocument?: string;
  profilePhoto?: string;
  certifications?: string[];
}

export interface IDoctorDocumentService {
  /**
   * Uploads all doctor-related documents to the appropriate storage folders.
   * Encapsulates folder paths and batch uploading logic.
   */
  uploadAll(files: DoctorUploadFilesDTO): Promise<DoctorUploadResults>;
}

import { IDoctorDocumentService, DoctorUploadFilesDTO, DoctorUploadResults } from "../interfaces/services/IDoctorDocumentService";
import { IFileStorageService } from "../interfaces/services/IFileStorageService";

export class DoctorDocumentService implements IDoctorDocumentService {
  constructor(private readonly fileStorage: IFileStorageService) {}

  async uploadAll(files: DoctorUploadFilesDTO): Promise<DoctorUploadResults> {
    const results: DoctorUploadResults = {};

    // 🔗 Centralized folder configuration logic (No magic strings in UseCase)
    const folders = {
      license: "mediconnect/doctors/licenses",
      photo: "mediconnect/doctors/photos",
      cert: "mediconnect/doctors/certifications",
    };

    // 1. License Document
    if (files.licenseDocument?.[0]) {
      results.licenseDocument = await this.fileStorage.upload(
        files.licenseDocument[0].buffer,
        folders.license
      );
    }

    // 2. Profile Photo
    if (files.profilePhoto?.[0]) {
      results.profilePhoto = await this.fileStorage.upload(
        files.profilePhoto[0].buffer,
        folders.photo
      );
    }

    // 3. Certifications (Handles loops and grouping)
    if (files.certifications?.length) {
      const uploadPromises = files.certifications.map(file => 
        this.fileStorage.upload(file.buffer, folders.cert)
      );
      results.certifications = await Promise.all(uploadPromises);
    }

    return results;
  }
}

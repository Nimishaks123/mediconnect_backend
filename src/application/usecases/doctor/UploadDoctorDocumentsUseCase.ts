import { IUploadDoctorDocumentsUseCase } from "@application/interfaces/doctor/IUploadDoctorDocumentsUseCase";
import { UploadDoctorDocumentsDTO, UploadDoctorDocumentsResponseDTO } from "@application/dtos/doctor/UploadDoctorDocumentsDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IFileStorageService } from "@application/interfaces/services/IFileStorageService";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import logger from "@common/logger";
import { config } from "@common/config";

export class UploadDoctorDocumentsUseCase implements IUploadDoctorDocumentsUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly fileStorageService: IFileStorageService
  ) {}

  private validateFile(file: Express.Multer.File, fieldName: string) {
    // 1️⃣ Validate type: jpg, png, pdf
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new AppError(
        `Invalid file type for ${fieldName}. Allowed: jpg, png, pdf`,
        StatusCode.BAD_REQUEST
      );
    }

    // 2️⃣ Validate size: max 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new AppError(
        `File ${fieldName} is too large. Max size: 5MB`,
        StatusCode.BAD_REQUEST
      );
    }
  }

  private validateCloudinaryUrl(url: string) {
    const cloudName = config.cloudinaryCloudName;
    if (!cloudName) {
      throw new Error("CLOUDINARY_CLOUD_NAME is not configured");
    }

    const pattern = new RegExp(
      `^https?:\\/\\/res\\.cloudinary\\.com\\/${cloudName}\\/image\\/upload\\/.*`,
      "i"
    );

    if (!pattern.test(url)) {
      throw new AppError("Invalid Cloudinary URL provided. Only internal Cloudinary URLs are allowed.", StatusCode.BAD_REQUEST);
    }
  }

  async execute(input: UploadDoctorDocumentsDTO): Promise<UploadDoctorDocumentsResponseDTO> {
    const { userId, files, profilePhotoUrl } = input;

    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) {
      throw new AppError(MESSAGES.DOCTOR_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    // Enforce REQUIRED licenseDocument
    if (!files.licenseDocument || files.licenseDocument.length === 0) {
      if (!doctor.licenseDocument) {
        throw new AppError("License document is required", StatusCode.BAD_REQUEST);
      }
    }

    // Validate Files
    if (files.licenseDocument) {
      files.licenseDocument.forEach((file) => this.validateFile(file, "licenseDocument"));
    }

    if (files.certifications) {
      if (files.certifications.length > 10) {
        throw new AppError("Maximum 10 certifications allowed", StatusCode.BAD_REQUEST);
      }
      files.certifications.forEach((file) => this.validateFile(file, "certifications"));
    }

    // Validate Cloudinary URL if provided
    if (profilePhotoUrl) {
      this.validateCloudinaryUrl(profilePhotoUrl);
    }

    try {
      let licenseUrl: string | undefined;
      let certificationUrls: string[] | undefined;

      // Single Upload: License Document
      if (files.licenseDocument && files.licenseDocument[0]) {
        licenseUrl = await this.fileStorageService.uploadSingle(files.licenseDocument[0]);
      }

      // Multiple Upload: Certifications
      if (files.certifications && files.certifications.length > 0) {
        certificationUrls = await this.fileStorageService.uploadMultiple(files.certifications);
      }

      // Store ONLY URLs in entity.
      // profilePhotoUrl is already an external URL and was validated above.
      doctor.updateDocuments({
        profilePhoto: profilePhotoUrl,
        licenseDocument: licenseUrl,
        certifications: certificationUrls,
      });

      const updated = await this.doctorRepo.save(doctor);
      logger.info("Doctor documents processed", { 
        userId, 
        hasNewLicense: !!licenseUrl,
        hasNewPhoto: !!profilePhotoUrl,
        newCertCount: certificationUrls?.length || 0
      });

      return {
        doctor: updated,
        message: "Documents uploaded and saved successfully",
      };
    } catch (error) {
      logger.error("Error in UploadDoctorDocumentsUseCase", { error, userId });
      throw error;
    }
  }
}

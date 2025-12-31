import { IUploadDoctorDocumentsUseCase } from "../../interfaces/doctor/IUploadDoctorDocumentsUseCase";
import { UploadDoctorDocumentsDTO } from "../../dtos/doctor/UploadDoctorDocumentsDTO";
import { UploadDoctorDocumentsResponseDTO } from "../../dtos/doctor/UploadDoctorDocumentsDTO";

import { IDoctorRepository } from "../../../domain/interfaces/IDoctorRepository";
import { IFileStorageService } from "../../interfaces/services/IFileStorageService";
import { DoctorOnboardingStatus } from "@domain/enums/DoctorOnboardingStatus";
import { DoctorMapper } from "@application/mappers/DoctorMapper";
import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
// import { DoctorMapper } from "../../mappers/DoctorMapper";

export class UploadDoctorDocumentsUseCase
  implements IUploadDoctorDocumentsUseCase
{
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly fileStorage: IFileStorageService
  ) {}

  async execute(
    input: UploadDoctorDocumentsDTO
  ): Promise<UploadDoctorDocumentsResponseDTO> {
    const { userId, files } = input;

    if (!userId) {
      throw new AppError("User ID is required", StatusCode.BAD_REQUEST);
    }

    if (!files) {
      throw new AppError(
        "No files received",
        StatusCode.BAD_REQUEST
      );
    }

    if (
      !files.licenseDocument?.length &&
      !files.profilePhoto?.length &&
      !files.certifications?.length
    ) {
      throw new AppError(
        "At least one document must be uploaded",
        StatusCode.BAD_REQUEST
      );
    }

    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) {
      throw new AppError(
        MESSAGES.DOCTOR_PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND
      );
    }

    const uploads: {
      licenseDocument?: string;
      profilePhoto?: string;
      certifications?: string[];
    } = {};

    // License
    if (files.licenseDocument?.[0]) {
      uploads.licenseDocument = await this.fileStorage.upload(
        files.licenseDocument[0].buffer,
        "mediconnect/doctors/licenses"
      );
    }

    // Profile Photo
    if (files.profilePhoto?.[0]) {
      uploads.profilePhoto = await this.fileStorage.upload(
        files.profilePhoto[0].buffer,
        "mediconnect/doctors/photos"
      );
    }

    // Certifications
    if (files.certifications?.length) {
      uploads.certifications = [];
      for (const file of files.certifications) {
        uploads.certifications.push(
          await this.fileStorage.upload(
            file.buffer,
            "mediconnect/doctors/certifications"
          )
        );
      }
    }

    // ✅ SINGLE atomic update
    const updatedDoctor = await this.doctorRepo.updateByUserId(userId, {
      ...uploads,
      onboardingStatus: DoctorOnboardingStatus.DOCUMENTS_PENDING,
    });

    if (!updatedDoctor) {
      throw new AppError(
        MESSAGES.DOCTOR_PROFILE_UPDATE_FAILED,
        StatusCode.INTERNAL_ERROR
      );
    }

    return {
      doctor: DoctorMapper.toResponse(updatedDoctor),
      message: "Documents uploaded successfully",
    };
  }
}

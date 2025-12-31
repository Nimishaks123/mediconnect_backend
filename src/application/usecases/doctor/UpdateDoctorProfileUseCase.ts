import { IUpdateDoctorProfileUseCase } from "../../interfaces/doctor/IUpdateDoctorProfileUseCase";
import { UpdateDoctorProfileDTO } from "../../dtos/doctor/UpdateDoctorProfileDTO";
import { UpdateDoctorProfileResponseDTO } from "../../dtos/doctor/UpdateDoctorProfileDTO";
import { DoctorOnboardingStatus } from "@domain/enums/DoctorOnboardingStatus";
import { IDoctorRepository } from "../../../domain/interfaces/IDoctorRepository";

import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
import { DoctorMapper } from "../../mappers/DoctorMapper";

export class UpdateDoctorProfileUseCase
  implements IUpdateDoctorProfileUseCase
{
  constructor(private readonly doctorRepo: IDoctorRepository) {}

  async execute(
    input: UpdateDoctorProfileDTO
  ): Promise<UpdateDoctorProfileResponseDTO> {
    const { userId, updates } = input;

    if (!userId || !updates) {
      throw new AppError(
        MESSAGES.DOCTOR_PROFILE_UPDATE_INVALID ??
          "Invalid update request",
        StatusCode.BAD_REQUEST
      );
    }
    const existing = await this.doctorRepo.findByUserId(userId);
    if (!existing) {
      throw new AppError(
        MESSAGES.DOCTOR_PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND
      );
    }

   const updated = await this.doctorRepo.updateByUserId(userId, {
  ...updates,
  onboardingStatus: DoctorOnboardingStatus.BASIC_INFO,
});

    if (!updated) {
      throw new AppError(
        MESSAGES.DOCTOR_PROFILE_UPDATE_FAILED,
        StatusCode.INTERNAL_ERROR
      );
    }

    return {
       doctor: DoctorMapper.toResponse(updated),
      message:
        MESSAGES.DOCTOR_PROFILE_UPDATED ??
        "Doctor profile updated successfully",
    };
  }
}

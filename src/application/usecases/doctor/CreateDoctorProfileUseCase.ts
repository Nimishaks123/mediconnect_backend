import { ICreateDoctorProfileUseCase } from "../../interfaces/doctor/ICreateDoctorProfileUseCase";
import { CreateDoctorProfileDTO } from "../../dtos/doctor/CreateDoctorProfileDTO";
import { CreateDoctorProfileResponseDTO } from "../../dtos/doctor/CreateDoctorProfileDTO";

import { IDoctorRepository } from "../../../domain/interfaces/IDoctorRepository";

import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
import { DoctorMapper } from "../../mappers/DoctorMapper";


export class CreateDoctorProfileUseCase
  implements ICreateDoctorProfileUseCase
{
  constructor(private readonly doctorRepo: IDoctorRepository) {}

  async execute(
    input: CreateDoctorProfileDTO
  ): Promise<CreateDoctorProfileResponseDTO> {

    const doctor = await this.doctorRepo.findByUserId(input.userId);
    if (!doctor) {
      throw new AppError(
        MESSAGES.DOCTOR_ONBOARDING_NOT_STARTED ?? "Doctor onboarding not started",
        StatusCode.BAD_REQUEST
      );
    }

    doctor.specialty = input.specialty;
    doctor.qualification = input.qualification;
    doctor.experience = input.experience;
    doctor.consultationFee = input.consultationFee;
    doctor.registrationNumber = input.registrationNumber;
    doctor.aboutMe = input.aboutMe;

    doctor.completeBasicInfo();;

    const updated = await this.doctorRepo.updateByUserId(input.userId, {
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      registrationNumber: doctor.registrationNumber,
      aboutMe: doctor.aboutMe,
      onboardingStatus: doctor.onboardingStatus,
    });

    if (!updated) {
      throw new AppError(
        MESSAGES.DOCTOR_PROFILE_UPDATE_FAILED ?? "Failed to update doctor profile",
        StatusCode.INTERNAL_ERROR
      );
    }
    return {
     doctor: DoctorMapper.toResponse(updated),
      message:
        MESSAGES.DOCTOR_BASIC_PROFILE_CREATED ??
        "Doctor basic profile created successfully",
    };
  }
}

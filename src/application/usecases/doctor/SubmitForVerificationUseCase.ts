// import { ISubmitForVerificationUseCase } from "../../interfaces/doctor/ISubmitForVerificationUseCase";
// import { SubmitForVerificationDTO } from "../../dtos/doctor/SubmitForVerificationDTO";
// import { SubmitForVerificationResponseDTO } from "../../dtos/doctor/SubmitForVerificationDTO";

// import { IDoctorRepository } from "../../../domain/interfaces/IDoctorRepository";

// import { AppError } from "../../../common/AppError";
// import { MESSAGES } from "../../../common/constants";
// import { StatusCode } from "../../../common/enums";
// import { DoctorMapper } from "../../mappers/DoctorMapper";

// export class SubmitForVerificationUseCase
//   implements ISubmitForVerificationUseCase
// {
//   constructor(private readonly doctorRepo: IDoctorRepository) {}

//   async execute(
//     input: SubmitForVerificationDTO
//   ): Promise<SubmitForVerificationResponseDTO> {
//     const { userId } = input;

//     if (!userId) {
//       throw new AppError(
//         MESSAGES.USER_NOT_FOUND,
//         StatusCode.BAD_REQUEST
//       );
//     }

//     const doctor = await this.doctorRepo.findByUserId(userId);
//     if (!doctor) {
//       throw new AppError(
//         MESSAGES.DOCTOR_PROFILE_NOT_FOUND,
//         StatusCode.NOT_FOUND
//       );
//     }
//     if (!doctor.specialty || !doctor.registrationNumber) {
//       throw new AppError(
//         MESSAGES.DOCTOR_BASIC_PROFILE_INCOMPLETE ??
//           "Basic profile must be completed before verification",
//         StatusCode.BAD_REQUEST
//       );
//     }

//     doctor.submitForVerification();

//     const updated = await this.doctorRepo.updateByUserId(userId, {
//       onboardingStatus: doctor.onboardingStatus,
//       verificationStatus: doctor.verificationStatus,
//       rejectionReason: doctor.rejectionReason,
//     });

//     if (!updated) {
//       throw new AppError(
//         MESSAGES.DOCTOR_PROFILE_UPDATE_FAILED,
//         StatusCode.INTERNAL_ERROR
//       );
//     }
//     return {
//       doctor: DoctorMapper.toResponse(updated),
//       message:
//         MESSAGES.DOCTOR_SUBMITTED_FOR_VERIFICATION ??
//         "Doctor submitted for verification",
//     };
//   }
// }
import { DoctorVerificationStatus } from "@domain/enums/DoctorVerificationStatus";
//import { DoctorOnboardingStatus } from "@domain/enums/DoctorOnboardingStatus";

import { ISubmitForVerificationUseCase } from "../../interfaces/doctor/ISubmitForVerificationUseCase";
import { SubmitForVerificationDTO } from "../../dtos/doctor/SubmitForVerificationDTO";
import { SubmitForVerificationResponseDTO } from "../../dtos/doctor/SubmitForVerificationDTO";

import { IDoctorRepository } from "../../../domain/interfaces/IDoctorRepository";
import { DoctorOnboardingStatus } from "@domain/enums/DoctorOnboardingStatus";

import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
import { DoctorMapper } from "../../mappers/DoctorMapper";

export class SubmitForVerificationUseCase
  implements ISubmitForVerificationUseCase
{
  constructor(private readonly doctorRepo: IDoctorRepository) {}

  async execute(
    input: SubmitForVerificationDTO
  ): Promise<SubmitForVerificationResponseDTO> {
    const { userId } = input;

    if (!userId) {
      throw new AppError(
        MESSAGES.USER_NOT_FOUND,
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

    // ✅ 1. Must be after document upload
    if (doctor.onboardingStatus !== DoctorOnboardingStatus.DOCUMENTS_PENDING) {
      throw new AppError(
        "Upload documents before submitting for verification",
        StatusCode.BAD_REQUEST
      );
    }

    // ✅ 2. Basic profile validation (minimal & correct)
    if (!doctor.specialty || !doctor.registrationNumber) {
      throw new AppError(
        MESSAGES.DOCTOR_BASIC_PROFILE_INCOMPLETE ??
          "Basic profile must be completed before verification",
        StatusCode.BAD_REQUEST
      );
    }

    // ✅ 3. Document validation
    if (!doctor.licenseDocument) {
      throw new AppError(
        "License document not uploaded",
        StatusCode.BAD_REQUEST
      );
    }

    // ✅ 4. Final state transition
    const updated = await this.doctorRepo.updateByUserId(userId, {
  onboardingStatus: DoctorOnboardingStatus.SUBMITTED,
  verificationStatus: DoctorVerificationStatus.PENDING, 
  rejectionReason: null,
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
        MESSAGES.DOCTOR_SUBMITTED_FOR_VERIFICATION ??
        "Doctor submitted for verification",
    };
  }
}

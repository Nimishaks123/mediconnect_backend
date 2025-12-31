import { IStartDoctorOnboardingUseCase } from "../../interfaces/doctor/IStartDoctorOnboardingUseCase";
import { StartDoctorOnboardingDTO } from "../../dtos/doctor/StartDoctorOnboardingDTO";
import { StartDoctorOnboardingResponseDTO } from "../../dtos/doctor/StartDoctorOnboardingDTO";
import { IDoctorRepository } from "../../../domain/interfaces/IDoctorRepository";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { Doctor } from "../../../domain/entities/Doctor";
import { DoctorOnboardingStatus } from "@domain/enums/DoctorOnboardingStatus";
import { DoctorVerificationStatus } from "@domain/enums/DoctorVerificationStatus";
import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";
import { DoctorMapper } from "../../mappers/DoctorMapper";

export class StartDoctorOnboardingUseCase
  implements IStartDoctorOnboardingUseCase
{
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(
    input: StartDoctorOnboardingDTO
  ): Promise<StartDoctorOnboardingResponseDTO> {
    const { userId } = input;

    if (!userId) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCode.BAD_REQUEST);
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    // 🔐 SINGLE SOURCE OF TRUTH
    const existingDoctor = await this.doctorRepo.findByUserId(userId);

    if (existingDoctor) {
      return {
        doctor: DoctorMapper.toResponse(existingDoctor),
        message: MESSAGES.DOCTOR_ONBOARDING_RESUMED,
      };
    }

    // CREATE ONLY ONCE
    const doctor = new Doctor(
      userId,
      "",
      "",
      0,
      0,
      "",
      null,
      [],
      "",
      null,
      DoctorOnboardingStatus.BASIC_INFO,
      DoctorVerificationStatus.PENDING
    );

    const created = await this.doctorRepo.createDoctor(doctor);

    return {
      doctor: DoctorMapper.toResponse(created),
      message: MESSAGES.DOCTOR_ONBOARDING_STARTED,
    };
  }
}

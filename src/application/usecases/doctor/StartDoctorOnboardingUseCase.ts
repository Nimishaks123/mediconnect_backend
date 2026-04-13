import { IStartDoctorOnboardingUseCase } from "@application/interfaces/doctor/IStartDoctorOnboardingUseCase";
import { StartDoctorOnboardingDTO, StartDoctorOnboardingResponseDTO } from "@application/dtos/doctor/StartDoctorOnboardingDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { Doctor } from "@domain/entities/Doctor";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { DoctorMapper } from "@application/mappers/DoctorMapper";

export class StartDoctorOnboardingUseCase implements IStartDoctorOnboardingUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(input: StartDoctorOnboardingDTO): Promise<StartDoctorOnboardingResponseDTO> {
    const { userId } = input;

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const existingDoctor = await this.doctorRepo.findByUserId(userId);

    if (existingDoctor) {
      return {
        doctor: DoctorMapper.toResponse(existingDoctor),
        message: MESSAGES.DOCTOR_ONBOARDING_RESUMED,
      };
    }

    const doctor = Doctor.startOnboarding(userId);

    const created = await this.doctorRepo.save(doctor);

    return {
      doctor: DoctorMapper.toResponse(created),
      message: MESSAGES.DOCTOR_BASIC_PROFILE_CREATED ?? "Doctor onboarding started",
    };
  }
}

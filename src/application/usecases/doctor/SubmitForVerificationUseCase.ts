import { ISubmitForVerificationUseCase } from "@application/interfaces/doctor/ISubmitForVerificationUseCase";
import { SubmitForVerificationDTO, SubmitForVerificationResponseDTO } from "@application/dtos/doctor/SubmitForVerificationDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { DoctorMapper } from "@application/mappers/DoctorMapper";
import { DomainError } from "@domain/errors/DomainError";

export class SubmitForVerificationUseCase implements ISubmitForVerificationUseCase {
  constructor(private readonly doctorRepo: IDoctorRepository) {}

  async execute(input: SubmitForVerificationDTO): Promise<SubmitForVerificationResponseDTO> {
    const { userId } = input;

    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) {
      throw new AppError(MESSAGES.DOCTOR_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    try {
      doctor.submitForVerification();
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        throw new AppError(error.message, StatusCode.BAD_REQUEST);
      }
      throw error; 
    }

    const updated = await this.doctorRepo.save(doctor);

    return {
      doctor: DoctorMapper.toResponse(updated),
      message: MESSAGES.DOCTOR_SUBMITTED_FOR_VERIFICATION ?? "Doctor submitted for verification",
    };
  }
}

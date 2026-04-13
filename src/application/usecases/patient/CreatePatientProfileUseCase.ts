import { IPatientRepository } from "@domain/interfaces/IPatientRepository";
import { Patient } from "@domain/entities/Patient";
import { AppError } from "@common/AppError";
import { CreatePatientProfileDTO } from "@application/dtos/patient/CreatePatientProfileDTO";
import { CreatePatientProfileResponseDTO } from "@application/dtos/patient/CreatePatientProfileResponseDTO";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";

export class CreatePatientProfileUseCase {
  constructor(
    private readonly patientRepo: IPatientRepository,
  ) { }

  async execute(data: CreatePatientProfileDTO): Promise<CreatePatientProfileResponseDTO> {
    const existing = await this.patientRepo.findByUserId(data.userId);

    if (existing) {
      throw new AppError(
        MESSAGES.PATIENT_PROFILE_ALREADY_EXISTS,
        StatusCode.BAD_REQUEST
      );
    }

    // Age calculation logic
    let age = data.age;
    if (data.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(data.dateOfBirth);
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    // Delegate creation logic to domain factory
    const patient = Patient.create({ ...data, age });

    // Atomic aggregate persistence
    const savedPatient = await this.patientRepo.save(patient);

    return {
      message: MESSAGES.PATIENT_PROFILE_CREATED_SUCCESSFULLY,
      patient: savedPatient
    };
  }
}

import { IPatientRepository } from "@domain/interfaces/IPatientRepository";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { Patient } from "@domain/entities/Patient";
import { UpdatePatientProfileDTO } from "@application/dtos/patient/UpdatePatientProfileDTO";

export interface UpdatePatientProfileResponseDTO {
  message: string;
  patient: Patient; 
}

import { IUpdatePatientProfileUseCase } from "../../interfaces/patient/IUpdatePatientProfileUseCase";

export class UpdatePatientProfileUseCase implements IUpdatePatientProfileUseCase {
  constructor(
    private readonly patientRepo: IPatientRepository,
  ) {}

 
  async execute(input: UpdatePatientProfileDTO): Promise<UpdatePatientProfileResponseDTO> {
    const { userId, updates } = input;

    const existing = await this.patientRepo.findByUserId(userId);
    if (!existing) {
      throw new AppError(MESSAGES.PATIENT_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    let age = updates.age;
    if (updates.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(updates.dateOfBirth);
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    existing.updateProfile({ ...updates, age });

    const saved = await this.patientRepo.save(existing);

    return {
      message: MESSAGES.PATIENT_PROFILE_UPDATED_SUCCESSFULLY,
      patient: saved
    };
  }
}

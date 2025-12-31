

import { IPatientRepository } from "../../../domain/interfaces/IPatientRepository";
import { AppError } from "../../../common/AppError";

export class UpdatePatientProfileUseCase {
  constructor(
    private readonly patientRepo: IPatientRepository,
  ) {}

  async execute(userId: string, updates: Partial<{
    dateOfBirth: Date | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    medicalHistory: Record<string, any>;
    allergies: string[];
    bloodGroup: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
  }>) {

    const existing = await this.patientRepo.findByUserId(userId);
    if (!existing) throw new AppError("Patient profile not found", 404);

    const updated = await this.patientRepo.updateByUserId(userId, updates);

    return {
      message: "Patient profile updated successfully",
      patient: updated
    };
  }
}

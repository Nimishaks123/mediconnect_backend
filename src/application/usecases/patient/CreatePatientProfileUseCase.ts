

import { IPatientRepository } from "../../../domain/interfaces/IPatientRepository";
import { Patient } from "../../../domain/entities/Patient";
import { AppError } from "../../../common/AppError";

export class CreatePatientProfileUseCase {
  constructor(
    private readonly patientRepo: IPatientRepository,
  ) {}

  async execute(data: {
    userId: string;
    dateOfBirth: Date | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;

    medicalHistory?: Record<string, any>;
    allergies?: string[];
    bloodGroup?: string | null;
    
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
  }) {

    const existing = await this.patientRepo.findByUserId(data.userId);
    if (existing) throw new AppError("Patient profile already exists", 400);

    const patient = new Patient(
      data.userId,
      data.dateOfBirth,
      data.gender,
      data.medicalHistory ?? {},
      data.allergies ?? [],
      data.bloodGroup ?? null,
      data.emergencyContactName ?? null,
      data.emergencyContactPhone ?? null
    );

    const created = await this.patientRepo.createPatient(patient);

    return {
      message: "Patient profile created successfully",
      patient: created
    };
  }
}

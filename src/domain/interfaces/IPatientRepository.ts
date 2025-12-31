// src/domain/interfaces/IPatientRepository.ts
import { Patient } from "../entities/Patient";

export interface IPatientRepository {
  create(patient: Patient): Promise<Patient>;     // inherited behavior
  findByUserId(userId: string): Promise<Patient | null>;
  updateByUserId(
    userId: string,
    update: Partial<Patient>
  ): Promise<Patient | null>;
}

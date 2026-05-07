import { Patient } from "../entities/Patient";

export interface IPatientRepository {
  findByUserId(userId: string): Promise<Patient | null>;
  findById(id: string): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient>;
}

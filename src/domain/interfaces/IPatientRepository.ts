import { Patient } from "../entities/Patient";

export interface IPatientRepository {
  /**
   * Finder methods for aggregate retrieval.
   */
  findByUserId(userId: string): Promise<Patient | null>;
  findById(id: string): Promise<Patient | null>;

  /**
   * Aggregate Save Pattern Standard for all persistence .
   */
  save(patient: Patient): Promise<Patient>;
}

import { Patient } from "../../domain/entities/Patient";
import { IPatientRepository } from "../../domain/interfaces/IPatientRepository";
import { PatientModel, PatientDB } from "./models/PatientModel";
import { BaseRepository } from "./BaseRepository";
import { AppError } from "../../common/AppError";
import { PatientPersistenceMapper } from "./mappers/PatientPersistenceMapper";

export class PatientRepository
  extends BaseRepository<Patient, PatientDB>
  implements IPatientRepository {

  constructor() {
    super(PatientModel);
  }

  /**
   *  Map from Persistence to Domain
   */
  protected toDomain(doc: PatientDB): Patient {
    return PatientPersistenceMapper.toDomain(doc);
  }

  /**
   * 🏗️ Map from Domain to Persistence
   */
  protected toPersistence(entity: Patient): Partial<PatientDB> {
    return PatientPersistenceMapper.toPersistence(entity) as Partial<PatientDB>;
  }

  /**
   * 🔍 Find a patient by user ID
   */
  async findByUserId(userId: string): Promise<Patient | null> {
    return this.findOne({ userId });
  }

  /**
   * 🔍 Find a patient by ID
   */
  async findById(id: string): Promise<Patient | null> {
    const doc = await this.model.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  /**
   * 💾 Save/Update patient profile
   */
  async save(patient: Patient): Promise<Patient> {
    const data = this.toPersistence(patient);
    
    // Use findOneAndUpdate with upsert for resilient creation/update
    const updated = await this.model.findOneAndUpdate(
      { userId: data.userId },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!updated) {
      throw new AppError("Failed to save patient profile", 500);
    }

    return this.toDomain(updated);
  }
}

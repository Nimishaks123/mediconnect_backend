import { Patient } from "../../domain/entities/Patient";
import { IPatientRepository } from "../../domain/interfaces/IPatientRepository";
import { PatientModel, PatientDB } from "./models/PatientModel";
import { BaseRepository } from "./BaseRepository";

export class PatientRepository
  extends BaseRepository<Patient, PatientDB>
  implements IPatientRepository {

  constructor() {
    super(PatientModel);
  }

  protected toDomain(doc: PatientDB): Patient {
    return new Patient(
      doc.userId.toString(),
      doc.dateOfBirth,
      doc.gender,
      doc.medicalHistory ?? {},
      doc.allergies ?? [],
      doc.bloodGroup,
      doc.emergencyContactName,
      doc.emergencyContactPhone,
      doc.createdAt,
      doc.updatedAt,
      doc._id.toString()
    );
  }

  protected toPersistence(entity: Patient): Partial<PatientDB> {
    return {
      userId: entity.userId,
      dateOfBirth: entity.dateOfBirth,
      gender: entity.gender,
      medicalHistory: entity.medicalHistory,
      allergies: entity.allergies,
      bloodGroup: entity.bloodGroup,
      emergencyContactName: entity.emergencyContactName,
      emergencyContactPhone: entity.emergencyContactPhone,
    };
  }

  // ✅ Domain-specific methods only
  async findByUserId(userId: string): Promise<Patient | null> {
    return this.findOne({ userId });
  }

  async updateByUserId(
    userId: string,
    update: Partial<Patient>
  ): Promise<Patient | null> {
    return this.update({ userId }, update);
  }
}

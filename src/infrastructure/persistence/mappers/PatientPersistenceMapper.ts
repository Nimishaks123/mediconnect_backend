import { Patient } from "../../../domain/entities/Patient";
import { PatientDB } from "../../../infrastructure/persistence/models/PatientModel";

export class PatientMapper {
  static toDomain(doc: PatientDB): Patient {
    return new Patient(
      doc.userId.toString(),
      doc.dateOfBirth,
      doc.gender,
      doc.medicalHistory,
      doc.allergies,
      doc.bloodGroup,
      doc.emergencyContactName,
      doc.emergencyContactPhone,
      doc.createdAt,
      doc.updatedAt,
      doc._id.toString()
    );
  }

  static toPersistence(patient: Patient) {
    return {
      userId: patient.userId,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
      bloodGroup: patient.bloodGroup,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactPhone: patient.emergencyContactPhone,
    };
  }
}

import { Patient } from "../../../domain/entities/Patient";
import { PatientDB } from "../models/PatientModel";

export class PatientPersistenceMapper {
  static toDomain(doc: PatientDB): Patient {
    return Patient.rehydrate({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      name: doc.name,
      age: doc.age,
      gender: doc.gender,
      phone: doc.phone,
      address: doc.address,
      profileImage: doc.profileImage,
      dateOfBirth: doc.dateOfBirth,
      medicalHistory: doc.medicalHistory,
      allergies: doc.allergies,
      bloodGroup: doc.bloodGroup,
      emergencyContactName: doc.emergencyContactName,
      emergencyContactPhone: doc.emergencyContactPhone,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(patient: Patient): Partial<PatientPersistenceDTO> {
    return {
      userId: patient.userId,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      profileImage: patient.profileImage,
      dateOfBirth: patient.dateOfBirth,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
      bloodGroup: patient.bloodGroup,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactPhone: patient.emergencyContactPhone,
    };
  }
}

interface PatientPersistenceDTO {
  userId: string;
  name: string;
  age: number;
  gender: string | null;
  phone: string;
  address: string | null;
  profileImage: string | null;
  dateOfBirth: Date | null;
  medicalHistory: Record<string, any>;
  allergies: string[];
  bloodGroup: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

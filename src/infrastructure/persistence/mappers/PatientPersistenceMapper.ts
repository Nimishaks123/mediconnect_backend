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
     userId: patient.getUserId(),
    name: patient.getName(),
    age: patient.getAge(),
    gender: patient.getGender(),
    phone: patient.getPhone(),
    address: patient.getAddress(),
    profileImage: patient.getProfileImage(),
    dateOfBirth: patient.getDateOfBirth(),
    medicalHistory: patient.getMedicalHistory(),
    allergies: patient.getAllergies(),
    bloodGroup: patient.getBloodGroup(),
    emergencyContactName: patient.getEmergencyContactName(),
    emergencyContactPhone: patient.getEmergencyContactPhone(),
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

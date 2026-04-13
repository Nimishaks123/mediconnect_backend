import { Patient } from "@domain/entities/Patient";
import { PatientResponseDTO } from "../dtos/patient/PatientResponseDTO";

export class PatientMapper {
  static toResponse(patient: Patient): PatientResponseDTO {
    return {
      id: patient.id,
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

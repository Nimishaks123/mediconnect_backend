import { Patient } from "@domain/entities/Patient";
import { PatientResponseDTO } from "../dtos/patient/PatientResponseDTO";

export class PatientMapper {
  static toResponse(patient: Patient): PatientResponseDTO {
    return {
      id: patient.getId(),
      userId: patient.getUserId(),
      name: patient.getName(),
      age: patient.getAge(),
      phone: patient.getPhone(),
      address: patient.getAddress(),
      profileImage: patient.getProfileImage(),
      dateOfBirth: patient.getDateOfBirth(),
      gender: patient.getGender(),
      medicalHistory: patient.getMedicalHistory(),
      allergies: patient.getAllergies(),
      bloodGroup: patient.getBloodGroup(),
      emergencyContactName: patient.getEmergencyContactName(),
      emergencyContactPhone: patient.getEmergencyContactPhone(),
    };
  }
}

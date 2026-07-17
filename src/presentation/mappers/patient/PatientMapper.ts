import { Patient } from "@domain/entities/Patient";
import { PatientResponseDTO } from "@application/dtos/patient/PatientResponseDTO";

import { User } from "@domain/entities/User";

export class PatientMapper {
  private static calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  static toCreatePatientProfileDTO(req: any): any {
    return {
      userId: req.user.id,
      name: req.body.name,
      // Age is no longer mandatory in creation, DOB is preferred
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
      profileImage: req.body.profileImage,
      dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null,
      medicalHistory: req.body.medicalHistory,
      allergies: req.body.allergies,
      bloodGroup: req.body.bloodGroup,
      emergencyContactName: req.body.emergencyContactName,
      emergencyContactPhone: req.body.emergencyContactPhone,
    };
  }

  static toUpdatePatientProfileDTO(req: any): any {
    return {
      userId: req.user.id,
      updates: {
        ...req.body,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
      }
    };
  }

  static toResponse(patient: Patient): PatientResponseDTO {
    // Dynamic age calculation with fallback for backward compatibility
    let calculatedAge = patient.getAge(); 
    if (patient.getDateOfBirth()) {
      calculatedAge = this.calculateAge(new Date(patient.getDateOfBirth()!));
    }

    return {
      id: patient.getId() ?? "",
      userId: patient.getUserId(),
      name: patient.getName(),
      age: calculatedAge,
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

  static toProfileResponse(user: User, patient: Patient) {
    return {
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        phoneNumber: user.getPhoneNumber(),
        role: user.getRole()
      },
      patient: this.toResponse(patient)
    };
  }
}

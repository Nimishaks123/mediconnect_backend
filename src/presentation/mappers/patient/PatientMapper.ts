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
    let calculatedAge = patient.age; 
    if (patient.dateOfBirth) {
      calculatedAge = this.calculateAge(new Date(patient.dateOfBirth));
    }

    return {
      id: patient.id ?? "",
      userId: patient.userId,
      name: patient.name,
      age: calculatedAge,
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

  static toProfileResponse(user: User, patient: Patient) {
    return {
      user: {
        id: user.getId(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      },
      patient: this.toResponse(patient)
    };
  }
}

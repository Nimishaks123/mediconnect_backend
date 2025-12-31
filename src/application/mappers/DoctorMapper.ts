import { Doctor } from "@domain/entities/Doctor";
import { DoctorResponseDTO } from "../dtos/doctor/DoctorResponseDTO";

export class DoctorMapper {
  static toResponse(doctor: Doctor): DoctorResponseDTO {
    return {
      id: doctor.id!,
      userId: doctor.userId,
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      registrationNumber: doctor.registrationNumber,
      aboutMe: doctor.aboutMe,
      profilePhoto: doctor.profilePhoto ?? null,
      licenseDocument: doctor.licenseDocument ?? null,
      certifications: doctor.certifications ?? [],
      onboardingStatus: doctor.onboardingStatus,
      verificationStatus: doctor.verificationStatus,
      verifiedBy: doctor.verifiedBy ?? null,
      verifiedAt: doctor.verifiedAt ?? null,
      rejectionReason: doctor.rejectionReason ?? null,
    };
  }
}

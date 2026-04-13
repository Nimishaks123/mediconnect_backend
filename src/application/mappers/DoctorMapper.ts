import { Doctor } from "@domain/entities/Doctor";
import { User } from "@domain/entities/User";
import { DoctorResponseDTO } from "../dtos/doctor/DoctorResponseDTO";
import { MESSAGES } from "@common/constants";

export class DoctorMapper {
  static toResponse(doctor: Doctor): DoctorResponseDTO {
    return {
      id: doctor.getId(),
      userId: doctor.getUserId(),
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

  static toVerifiedDoctorResponse(doctor: Doctor, user?: User | null) {
    return {
      doctorId: doctor.getId(),
      userId: doctor.getUserId(),
      name: user?.name ?? "Doctor",
      specialty: doctor.specialty,
      about: doctor.aboutMe,
      photo:
        doctor.profilePhoto && doctor.profilePhoto.trim() !== ""
          ? doctor.profilePhoto
          : MESSAGES.DEFAULT_DOCTOR_AVATAR,
    };
  }

  static toApproveDoctorResponse(doctor: Doctor) {
    return {
      message: "Doctor approved successfully",
      doctor: {
        id: doctor.getId(),
        userId: doctor.getUserId(),
        verificationStatus: doctor.verificationStatus,
        onboardingStatus: doctor.onboardingStatus,
        verifiedBy: doctor.verifiedBy ?? null,
        verifiedAt: doctor.verifiedAt?.toISOString() ?? null,
        rejectionReason: doctor.rejectionReason ?? null,
      },
    };
  }

  static toRejectDoctorResponse(doctor: Doctor) {
    return {
      message: "Doctor rejected successfully",
      doctor: {
        id: doctor.getId(),
        userId: doctor.getUserId(),
        verificationStatus: doctor.verificationStatus,
        onboardingStatus: doctor.onboardingStatus,
        verifiedBy: doctor.verifiedBy ?? null,
        verifiedAt: doctor.verifiedAt?.toISOString() ?? null,
        rejectionReason: doctor.rejectionReason ?? null,
      },
    };
  }
}

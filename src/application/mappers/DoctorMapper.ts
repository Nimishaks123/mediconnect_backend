import { Doctor } from "@domain/entities/Doctor";
import { User } from "@domain/entities/User";
import { DoctorResponseDTO } from "../dtos/doctor/DoctorResponseDTO";
import { MESSAGES } from "@common/constants";

export class DoctorMapper {
  static toResponse(doctor: Doctor): DoctorResponseDTO {
    return {
      id: doctor.getId(),
      userId: doctor.getUserId(),
      specialty: doctor.getSpecialty(),
      qualification: doctor.getQualification(),
      experience: doctor.getExperience(),
      consultationFee: doctor.getConsultationFee(),
      registrationNumber: doctor.getRegistrationNumber(),
      aboutMe: doctor.getAboutMe(),
      profilePhoto: doctor.getProfilePhoto() ?? null,
      licenseDocument: doctor.getLicenseDocument()?? null,
      certifications: doctor.getCertifications() ?? [],
      onboardingStatus: doctor.getOnboardingStatus(),
      verificationStatus: doctor.getVerificationStatus(),
      verifiedBy: doctor.getVerifiedBy() ?? null,
      verifiedAt: doctor.getVerifiedAt() ?? null,
      rejectionReason: doctor.getRejectionReason() ?? null,
    };
  }

  static toVerifiedDoctorResponse(doctor: Doctor, user?: User | null) {
    const profilePhoto =
  doctor.getProfilePhoto();
    return {
      doctorId: doctor.getId(),
      userId: doctor.getUserId(),
      name: user?.getName() ?? "Doctor",
      specialty: doctor.getSpecialty(),
      about: doctor.getAboutMe(),
      photo:
    profilePhoto &&
    profilePhoto.trim() !== ""
      ? profilePhoto
      : MESSAGES.DEFAULT_DOCTOR_AVATAR,
             experience:
      doctor.getExperience(),

    consultationFee:
      doctor.getConsultationFee(),
    };

  }

  static toApproveDoctorResponse(doctor: Doctor) {
    return {
      message: "Doctor approved successfully",
      doctor: {
        id: doctor.getId(),
        userId: doctor.getUserId(),
        verificationStatus: doctor.getVerificationStatus(),
        onboardingStatus: doctor.getOnboardingStatus(),
        verifiedBy: doctor.getVerifiedBy() ?? null,
        verifiedAt: doctor.getVerifiedAt()?.toISOString() ?? null,
        rejectionReason: doctor.getRejectionReason()?? null,
      },
    };
  }

  static toRejectDoctorResponse(doctor: Doctor) {
    return {
      message: "Doctor rejected successfully",
      doctor: {
        id: doctor.getId(),
        userId: doctor.getUserId(),
        verificationStatus: doctor.getVerificationStatus(),
        onboardingStatus: doctor.getOnboardingStatus(),
        verifiedBy: doctor.getVerifiedBy()?? null,
        verifiedAt: doctor.getVerifiedAt()?.toISOString() ?? null,
        rejectionReason: doctor.getRejectionReason()?? null,
      },
    };
  }
}

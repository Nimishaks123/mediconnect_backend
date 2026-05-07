import { Doctor } from "../../../domain/entities/Doctor";
import { DoctorDB } from "../models/DoctorModel";

export class DoctorPersistenceMapper {
static toDomain(doc: DoctorDB): Doctor {
    return Doctor.rehydrate({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      specialty: doc.specialty,
      qualification: doc.qualification,
      experience: doc.experience,
      consultationFee: doc.consultationFee,
      registrationNumber: doc.registrationNumber,
      licenseDocument: doc.licenseDocument,
      certifications: doc.certifications,
      aboutMe: doc.aboutMe,
      profilePhoto: doc.profilePhoto,
      onboardingStatus: doc.onboardingStatus,
      verificationStatus: doc.verificationStatus,
      verifiedBy: doc.verifiedBy,
      verifiedAt: doc.verifiedAt,
      rejectionReason: doc.rejectionReason,
    });
  }

  static toPersistence(doctor: Doctor): Partial<DoctorPersistenceDTO> {
    return {
userId: doctor.getUserId(),
specialty: doctor.getSpecialty(),
qualification: doctor.getQualification(),
experience: doctor.getExperience(),
consultationFee: doctor.getConsultationFee(),
registrationNumber: doctor.getRegistrationNumber(),
licenseDocument: doctor.getLicenseDocument(),
certifications: doctor.getCertifications(),
aboutMe: doctor.getAboutMe(),
profilePhoto: doctor.getProfilePhoto(),
onboardingStatus: doctor.getOnboardingStatus(),
verificationStatus: doctor.getVerificationStatus(),
verifiedBy: doctor.getVerifiedBy(),
verifiedAt: doctor.getVerifiedAt(),
rejectionReason: doctor.getRejectionReason(),
    };
  }
}

interface DoctorPersistenceDTO {
  userId: string;
  specialty: string | null;
  qualification: string | null;
  experience: number | null;
  consultationFee: number | null;
  registrationNumber: string | null;
  licenseDocument: string | null;
  certifications: string[];
  aboutMe: string | null;
  profilePhoto: string | null;
  onboardingStatus: string;
  verificationStatus: string;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  rejectionReason: string | null;
}

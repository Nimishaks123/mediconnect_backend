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
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      registrationNumber: doctor.registrationNumber,
      licenseDocument: doctor.licenseDocument,
      certifications: doctor.certifications,
      aboutMe: doctor.aboutMe,
      profilePhoto: doctor.profilePhoto,
      onboardingStatus: doctor.onboardingStatus,
      verificationStatus: doctor.verificationStatus,
      verifiedBy: doctor.verifiedBy,
      verifiedAt: doctor.verifiedAt,
      rejectionReason: doctor.rejectionReason,
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

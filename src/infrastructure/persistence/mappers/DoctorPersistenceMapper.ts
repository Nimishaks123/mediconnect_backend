import { Doctor } from "../../../domain/entities/Doctor";
import { DoctorDB } from "../../../infrastructure/persistence/models/DoctorModel";

export class DoctorMapper {
  static toDomain(doc: DoctorDB): Doctor {
    return new Doctor(
      doc.userId.toString(),
      doc.specialty ?? "",
      doc.qualification ?? "",
      doc.experience ?? 0,
      doc.consultationFee ?? 0,
      doc.registrationNumber ?? "",
      doc.licenseDocument,
      doc.certifications ?? [],
      doc.aboutMe ?? "",
      doc.profilePhoto,
      doc.onboardingStatus,
      doc.verificationStatus,
      doc.verifiedBy?.toString(),
      doc.verifiedAt || null,
      doc.rejectionReason || null,
      doc._id.toString()
    );
  }

  static toPersistence(doctor: Doctor) {
    return {
      userId: doctor.userId,
      specialty: doctor.specialty,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      registrationNumber: doctor.registrationNumber,
      licenseDocument: doctor.licenseDocument,
      certifications: doctor.certifications,
      aboutMe: doctor.aboutMe,
      profilePhoto: doctor.profilePhoto,
      verificationStatus: doctor.verificationStatus,
      verifiedBy: doctor.verifiedBy,
      verifiedAt: doctor.verifiedAt,
      rejectionReason: doctor.rejectionReason,
    };
  }
}

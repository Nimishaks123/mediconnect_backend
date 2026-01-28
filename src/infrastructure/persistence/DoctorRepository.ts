import { Doctor } from "../../domain/entities/Doctor";
import { IDoctorRepository } from "../../domain/interfaces/IDoctorRepository";
import { DoctorModel, DoctorDB } from "./models/DoctorModel";
import { BaseRepository } from "./BaseRepository";
import { AppError } from "../../common/AppError";
import { DoctorOnboardingStatus } 
  from "../../domain/enums/DoctorOnboardingStatus";

export class DoctorRepository
  extends BaseRepository<Doctor, DoctorDB>
  implements IDoctorRepository {

  constructor() {
    super(DoctorModel);
  }

  protected toDomain(doc: Partial<DoctorDB>): Doctor {
    return new Doctor(
      doc.userId!.toString(),
      doc.specialty ?? "",
      doc.qualification ?? "",
      doc.experience ?? 0,
      doc.consultationFee ?? 0,
      doc.registrationNumber ?? "",
      doc.licenseDocument ?? null,
      doc.certifications ?? [],
      doc.aboutMe ?? "",
      doc.profilePhoto ?? null,
      doc.onboardingStatus!,
      doc.verificationStatus!,
      doc.verifiedBy ? doc.verifiedBy.toString() : null,
      doc.verifiedAt ?? null,
      doc.rejectionReason ?? null,
      doc._id!.toString()
    );
  }

  protected toPersistence(entity: Doctor): Partial<DoctorDB> {
    return {
      userId: entity.userId,
      specialty: entity.specialty,
      qualification: entity.qualification,
      experience: entity.experience,
      consultationFee: entity.consultationFee,
      registrationNumber: entity.registrationNumber,
      licenseDocument: entity.licenseDocument,
      certifications: entity.certifications,
      aboutMe: entity.aboutMe,
      profilePhoto: entity.profilePhoto,
      onboardingStatus: entity.onboardingStatus,
      verificationStatus: entity.verificationStatus,
      verifiedBy: entity.verifiedBy,
      verifiedAt: entity.verifiedAt,
      rejectionReason: entity.rejectionReason,
    };
  }

  async createDoctor(doctor: Doctor): Promise<Doctor> {
  try {
    const created = await this.model.findOneAndUpdate(
      { userId: doctor.userId },
      { $setOnInsert: this.toPersistence(doctor) },
      {
        new: true,
        upsert: true,   
      }
    );

    return this.toDomain(created);
  } catch (error) {
    console.error("CREATE DOCTOR ERROR:", error);
    throw new AppError("Failed to create doctor", 500);
  }
  
}
  async findByUserId(userId: string): Promise<Doctor | null> {
    return this.findOne({ userId });
  }

  async findByOnboardingStatus(
    status: DoctorOnboardingStatus
  ): Promise<Doctor[]> {
    return this.findMany({ onboardingStatus: status });
  }

  async findByVerificationStatus(
    status: Doctor["verificationStatus"]
  ): Promise<Doctor[]> {
    return this.findMany({ verificationStatus: status });
  }

  async updateByUserId(
    userId: string,
    update: Partial<Doctor>
  ): Promise<Doctor> {
    const updated = await this.update({ userId }, update);
    if (!updated) {
      throw new AppError("Failed to update doctor profile", 500);
    }
    return updated;
  }

  async uploadDocuments(
    userId: string,
    update: {
      licenseDocument?: string;
      profilePhoto?: string;
      certifications?: string[];
    }
  ): Promise<Doctor> {
    const updated = await this.update({ userId }, update);
    if (!updated) {
      throw new AppError("Failed to upload doctor documents", 500);
    }
    return updated;
  }
  async findVerifiedDoctors(): Promise<Doctor[]> {
  const docs = await DoctorModel.find({
    verificationStatus: "APPROVED",
  });
  

 return docs.map((doc) => this.toDomain(doc));



}
}

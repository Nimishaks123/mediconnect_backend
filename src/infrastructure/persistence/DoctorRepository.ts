import { Doctor } from "../../domain/entities/Doctor";
import { IDoctorRepository } from "../../domain/interfaces/IDoctorRepository";
import { DoctorModel, DoctorDB } from "./models/DoctorModel";
import { BaseRepository } from "./BaseRepository";
import { AppError } from "../../common/AppError";
import { DoctorOnboardingStatus } from "../../domain/enums/DoctorOnboardingStatus";
import { Types } from "mongoose";
import { DoctorPersistenceMapper } from "./mappers/DoctorPersistenceMapper";

export class DoctorRepository
  extends BaseRepository<Doctor, DoctorDB>
  implements IDoctorRepository {

  constructor() {
    super(DoctorModel);
  }

  protected toDomain(doc: Partial<DoctorDB>): Doctor {
  return DoctorPersistenceMapper.toDomain(doc as DoctorDB);
}

  protected toPersistence(entity: Doctor): Partial<DoctorDB> {
    return DoctorPersistenceMapper.toPersistence(entity) as Partial<DoctorDB>;
  }

  async createDoctor(doctor: Doctor): Promise<Doctor> {
    try {
      const created = await this.model.findOneAndUpdate(
        { userId: new Types.ObjectId(doctor.getUserId()) },
        { $setOnInsert: this.toPersistence(doctor) },
        {
          new: true,
          upsert: true,
        }
      );

      if (!created) {
        throw new AppError("Failed to create doctor", 500);
      }

      return this.toDomain(created);
    } catch (error) {
      throw new AppError("Failed to create doctor", 500);
    }
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    return this.findOne({ userId: new Types.ObjectId(userId) });
  }

  async findById(id: string): Promise<Doctor | null> {
 
    return this.findOne({ _id: new Types.ObjectId(id) });
  }

  async findOneByRegistrationNumber(regNumber: string): Promise<Doctor | null> {
    
    return this.findOne({ registrationNumber: regNumber });
  }

  async findByOnboardingStatus(status: DoctorOnboardingStatus): Promise<Doctor[]> {
    return this.findMany({ onboardingStatus: status });
  }

  async findByVerificationStatus(status: Doctor["verificationStatus"]): Promise<Doctor[]> {
    return this.findMany({ verificationStatus: status });
  }

  async findVerifiedDoctors(): Promise<Doctor[]> {
   
    return this.findMany({ verificationStatus: "APPROVED" });
  }

  async save(doctor: Doctor): Promise<Doctor> {
 
   const id = doctor.getId();
  if (!id) {
    throw new AppError("Doctor ID is missing", 400);
  }

  const updated = await this.update(
    { _id: new Types.ObjectId(id) },
    this.toPersistence(doctor)
  );

  if (!updated) {
    throw new AppError("Failed to save doctor", 500);
  }

  return updated;
}
  }

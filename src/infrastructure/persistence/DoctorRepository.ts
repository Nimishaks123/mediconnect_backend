import { Doctor } from "../../domain/entities/Doctor";
import { IDoctorRepository } from "../../domain/interfaces/IDoctorRepository";
import { DoctorModel, DoctorDB } from "./models/DoctorModel";
import { BaseRepository } from "./BaseRepository";
import { AppError } from "../../common/AppError";
import { DoctorOnboardingStatus } from "../../domain/enums/DoctorOnboardingStatus";
import { Types } from "mongoose";
import { DoctorPersistenceMapper } from "./mappers/DoctorPersistenceMapper";
import { GetVerifiedDoctorsDTO } from "@application/dtos/doctor/GetVerifiedDoctorsDTO";
import { DoctorMapper } from "@application/mappers/DoctorMapper";
import { UserModel } from "./models/UserModel";

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
  async findDistinctSpecialties(): Promise<string[]> {
    return await DoctorModel.distinct("specialty",{verificationStatus:"APPROVED"});
  }

  async findVerifiedDoctors(
 dto?:GetVerifiedDoctorsDTO
):Promise<{
 doctors:Doctor[];
 total:number;
}>{

const page=
dto?.page || 1;

const limit=
dto?.limit || 10;

const skip=
(page-1)*limit;

const blockedUsers=await UserModel.find({blocked:true},{_id:1});
const blockedIds=blockedUsers.map(user=>user._id);
const filter:any={

verificationStatus:
"APPROVED",userId:{$nin:blockedIds}

};

if(dto?.specialty){

   filter.specialty=
   dto.specialty;

}

if(dto?.experience){

   filter.experience={

      $gte:
      Number(dto.experience)

   };

}
const sort: any = {};

switch (dto?.sortBy) {
  case "newest":
    sort.createdAt = -1;
    break;

  case "oldest":
    sort.createdAt = 1;
    break;

  case "experience_desc":
    sort.experience = -1;
    break;

  case "experience_asc":
    sort.experience = 1;
    break;

  case "fee_desc":
    sort.consultationFee = -1;
    break;

  case "fee_asc":
    sort.consultationFee = 1;
    break;

  case "name_asc":
    sort.name = 1;
    break;

  default:
    sort.createdAt = -1;
}
// const docs=await DoctorModel.find(filter).populate({path:"userId",match:{blocked:false,},}).skip(skip).limit(limit);
// const activeDoctors=docs.filter((doc)=>doc.userId);
const docs = await DoctorModel.find(filter)
  .sort(sort)
  .skip(skip)
  .limit(limit);
const total=
await DoctorModel
.countDocuments(filter);

return{

   doctors:docs.map(
      doc=>
      DoctorPersistenceMapper
      .toDomain(doc)
   ),

   total

};

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

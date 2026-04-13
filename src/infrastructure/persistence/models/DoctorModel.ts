import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { DoctorOnboardingStatus } from "../../../domain/enums/DoctorOnboardingStatus";
import { DoctorVerificationStatus } from "../../../domain/enums/DoctorVerificationStatus";

export interface DoctorDB extends Document {
  userId: Types.ObjectId; 

  specialty: string | null;
  qualification: string | null;
  experience: number | null;
  consultationFee: number | null;
  registrationNumber: string | null;

  licenseDocument: string | null;
  certifications: string[];

  aboutMe: string | null;
  profilePhoto: string | null;

  onboardingStatus: DoctorOnboardingStatus;
  verificationStatus: DoctorVerificationStatus;

  verifiedBy?: string | null;
  verifiedAt?: Date | null;
  rejectionReason?: string | null;
}

const DoctorSchema = new Schema<DoctorDB>(
  {
    userId: {
      type: Schema.Types.ObjectId, 
      ref: "User",              
      required: true,
      unique: true,
    },

    specialty: { type: String, default: null },
    qualification: { type: String, default: null },
    experience: { type: Number, default: null },
    consultationFee: { type: Number, default: null },
    registrationNumber: { type: String, default: null },

    licenseDocument: { type: String, default: null },
    certifications: { type: [String], default: [] },

    aboutMe: { type: String, default: null },
    profilePhoto: { type: String, default: null },

    onboardingStatus: {
      type: String,
      enum: Object.values(DoctorOnboardingStatus),
      default: DoctorOnboardingStatus.NOT_STARTED,
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: Object.values(DoctorVerificationStatus),
      default: DoctorVerificationStatus.PENDING,
      required: true,
    },

    verifiedBy: { type: String, default: null },
    verifiedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

export const DoctorModel: Model<DoctorDB> =
  mongoose.models.Doctor ||
  mongoose.model<DoctorDB>("Doctor", DoctorSchema);

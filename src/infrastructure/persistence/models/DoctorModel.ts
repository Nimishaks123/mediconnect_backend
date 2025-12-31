// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface DoctorDB extends Document {
//   userId: string; // IMPORTANT - store string, not ObjectId

//   specialty: string | null;
//   qualification: string | null;
//   experience: number | null;
//   consultationFee: number | null;
//   registrationNumber: string | null;

//   licenseDocument: string | null;
//   certifications: string[];

//   aboutMe: string | null;
//   profilePhoto: string | null;

//   onboardingStatus: "NOT_STARTED" | "BASIC_INFO" | "DOCUMENTS" | "SUBMITTED";
//   verificationStatus: "PENDING" | "APPROVED" | "REJECTED";

//   verifiedBy?: string | null;
//   verifiedAt?: Date | null;
//   rejectionReason?: string | null;
// }

// const DoctorSchema = new Schema<DoctorDB>(
//   {
//     // ⭐ IMPORTANT: Store userId as STRING, not ObjectId
//     userId: { type: String, required: true, unique: true },

//     specialty: { type: String, default: null },
//     qualification: { type: String, default: null },
//     experience: { type: Number, default: null },
//     consultationFee: { type: Number, default: null },
//     registrationNumber: { type: String, default: null },

//     licenseDocument: { type: String, default: null },
//     certifications: { type: [String], default: [] },

//     aboutMe: { type: String, default: null },
//     profilePhoto: { type: String, default: null },

//     onboardingStatus: {
//       type: String,
//       enum: ["NOT_STARTED", "BASIC_INFO", "DOCUMENTS", "SUBMITTED"],
//       default: "NOT_STARTED",
//     },

//     verificationStatus: {
//       type: String,
//       enum: ["PENDING", "APPROVED", "REJECTED"],
//       default: "PENDING",
//     },

//     verifiedBy: { type: String, default: null }, // store adminId as string
//     verifiedAt: { type: Date, default: null },
//     rejectionReason: { type: String, default: null },
//   },
//   { timestamps: true }
// );

// export const DoctorModel: Model<DoctorDB> =
//   mongoose.models.Doctor || mongoose.model<DoctorDB>("Doctor", DoctorSchema);
import mongoose, { Schema, Document, Model } from "mongoose";
import { DoctorOnboardingStatus } from "../../../domain/enums/DoctorOnboardingStatus";
import { DoctorVerificationStatus } from "../../../domain/enums/DoctorVerificationStatus";

export interface DoctorDB extends Document {
  userId: string; // stored as string (correct)

  specialty: string | null;
  qualification: string | null;
  experience: number | null;
  consultationFee: number | null;
  registrationNumber: string | null;

  licenseDocument: string | null;
  certifications: string[];

  aboutMe: string | null;
  profilePhoto: string | null;

  // ✅ USE DOMAIN ENUMS
  onboardingStatus: DoctorOnboardingStatus;
  verificationStatus: DoctorVerificationStatus;

  verifiedBy?: string | null;
  verifiedAt?: Date | null;
  rejectionReason?: string | null;
}

const DoctorSchema = new Schema<DoctorDB>(
  {
    userId: {
      type: String,
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
      enum: Object.values(DoctorOnboardingStatus), // 🔥 KEY FIX
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

// // src/infrastructure/persistence/models/PatientModel.ts

// import mongoose, { Schema, Document, Model, Types } from "mongoose";

// export interface PatientDB extends Document {
//   userId: Types.ObjectId;

//   dateOfBirth: Date | null;
//   gender: "MALE" | "FEMALE" | "OTHER" | null;

//   medicalHistory: Record<string, any>;
//   allergies: string[];

//   bloodGroup: string | null;

//   emergencyContactName: string | null;
//   emergencyContactPhone: string | null;

//   createdAt: Date;
//   updatedAt: Date;
// }

// const PatientSchema = new Schema<PatientDB>(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },

//     dateOfBirth: { type: Date, default: null },
//     gender: { type: String, enum: ["MALE", "FEMALE", "OTHER", null], default: null },

//     medicalHistory: { type: Object, default: {} },
//     allergies: { type: [String], default: [] },

//     bloodGroup: { type: String, default: null },

//     emergencyContactName: { type: String, default: null },
//     emergencyContactPhone: { type: String, default: null },
//   },
//   { timestamps: true }
// );

// export const PatientModel: Model<PatientDB> =
//   mongoose.models.Patient || mongoose.model<PatientDB>("Patient", PatientSchema);
import mongoose, { Schema, Document, Model } from "mongoose";

export interface PatientDB extends Document {
  userId: string; // ✅ STRING
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  phone: string;
  address: string | null;
  profileImage: string | null;
  dateOfBirth: Date | null;
  medicalHistory: Record<string, any>;
  allergies: string[];
  bloodGroup: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<PatientDB>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: null,
    },
    phone: { type: String, required: true },
    address: { type: String, default: null },
    profileImage: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    medicalHistory: { type: Object, default: {} },
    allergies: { type: [String], default: [] },
    bloodGroup: { type: String, default: null },
    emergencyContactName: { type: String, default: null },
    emergencyContactPhone: { type: String, default: null },
  },
  { timestamps: true }
);

export const PatientModel: Model<PatientDB> =
  mongoose.models.Patient ||
  mongoose.model<PatientDB>("Patient", PatientSchema);

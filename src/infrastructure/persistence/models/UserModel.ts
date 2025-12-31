// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface UserDB extends Document {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   passwordHash: string;
//   role: "PATIENT" | "DOCTOR" | "ADMIN";   
//   isVerified: boolean;
//   blocked: boolean;
//   documents: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema = new Schema<UserDB>(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phoneNumber: String,
//     passwordHash: { type: String, required: true },

//     // ⭐ FIXED ROLE ENUM
//     role: { 
//       type: String, 
//       enum: ["PATIENT", "DOCTOR", "ADMIN"], 
//       default: "PATIENT" 
//     },

//     isVerified: { type: Boolean, default: false },
//     blocked: { type: Boolean, default: false },

//     documents: [{ type: String }],
//   },
//   { timestamps: true }
// );

// export const UserModel: Model<UserDB> =
//   mongoose.models.User || mongoose.model<UserDB>("User", UserSchema);
// src/infrastructure/persistence/models/UserModel.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDB extends Document {
  name: string;
  email: string;
  phoneNumber?: string;
  passwordHash: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";

  isVerified: boolean;
  blocked: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDB>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "ADMIN"],
      default: "PATIENT",
    },

    isVerified: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel: Model<UserDB> =
  mongoose.models.User || mongoose.model<UserDB>("User", UserSchema);

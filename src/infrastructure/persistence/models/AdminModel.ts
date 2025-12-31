// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface AdminDB extends Document {
//   name: string;
//   email: string;
//   passwordHash: string;
//   role: "ADMIN";
// }

// const AdminSchema = new Schema<AdminDB>(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     passwordHash: { type: String, required: true },

//     role: {
//       type: String,
//       enum: ["ADMIN"],
//       default: "ADMIN",
//       immutable: true
//     }
//   },
//   { timestamps: true }
// );

// export const AdminModel: Model<AdminDB> =
//   mongoose.models.Admin || mongoose.model<AdminDB>("Admin", AdminSchema);
// src/infrastructure/persistence/models/AdminModel.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface AdminDB extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMIN";

  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<AdminDB>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN"], default: "ADMIN" },
  },
  { timestamps: true }
);

export const AdminModel: Model<AdminDB> =
  mongoose.models.Admin || mongoose.model<AdminDB>("Admin", AdminSchema);

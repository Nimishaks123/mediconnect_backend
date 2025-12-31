// src/infrastructure/persistence/models/OtpModel.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface OtpDB extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
  context: "SIGNUP" | "FORGOT_PASSWORD";   // 👈 NEW
  verified: boolean;                       // 👈 NEW
  createdAt: Date;
}

const OtpSchema = new Schema<OtpDB>(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },

    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },

    context: {
      type: String,
      enum: ["SIGNUP", "FORGOT_PASSWORD"],  // 👈 NEW
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,                       // 👈 NEW
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const OtpModel: Model<OtpDB> =
  mongoose.models.Otp || mongoose.model<OtpDB>("Otp", OtpSchema);

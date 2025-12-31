import mongoose, { Schema, Document } from "mongoose";

export interface DoctorAvailabilityDB extends Document {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

const DoctorAvailabilitySchema = new Schema<DoctorAvailabilityDB>(
  {
    doctorId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DoctorAvailabilityModel =
  mongoose.model<DoctorAvailabilityDB>(
    "DoctorAvailability",
    DoctorAvailabilitySchema
  );

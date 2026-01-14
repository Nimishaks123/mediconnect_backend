import mongoose, { Schema, Document } from "mongoose";

export interface DoctorScheduleDocument extends Document {
  doctorId: string;
  rrule: string;
  dailyStartTime: string;
  dailyEndTime: string;
  slotDurationMinutes: number;
  timezone: string;
}

const DoctorScheduleSchema = new Schema<DoctorScheduleDocument>(
  {
    doctorId: { type: String, required: true, unique: true },
    rrule: { type: String, required: true },
    dailyStartTime: { type: String, required: true },
    dailyEndTime: { type: String, required: true },
    slotDurationMinutes: { type: Number, required: true },
    timezone: { type: String, required: true },
  },
  { timestamps: true }
);

export const DoctorScheduleModel = mongoose.model<DoctorScheduleDocument>(
  "DoctorSchedule",
  DoctorScheduleSchema
);

import mongoose, { Schema, Document } from "mongoose";

/* ======================
   Time Window Subschema
   ====================== */
const TimeWindowSchema = new Schema(
  {
    start: { type: String, required: true }, // "09:00"
    end: { type: String, required: true },   // "13:00"
  },
  { _id: false }
);

/* ======================
   Doctor Schedule Schema
   ====================== */
const DoctorScheduleSchema = new Schema(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    rrule: {
      type: String,
      required: true,
    },

    timeWindows: {
      type: [TimeWindowSchema],
      required: true,
    },

    slotDuration: {
      type: Number,
      required: true,
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validTo: {
      type: Date,
      required: true,
    },

    timezone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* ======================
   Document Interface
   ====================== */
export interface DoctorScheduleDocument extends Document {
  doctorId: string;
  rrule: string;
  timeWindows: {
    start: string;
    end: string;
  }[];
  slotDuration: number;
  validFrom: Date;
  validTo: Date;
  timezone: string;
}

/* ======================
   Model Export ✅
   ====================== */
export const DoctorScheduleModel =
  mongoose.models.DoctorSchedule ||
  mongoose.model<DoctorScheduleDocument>(
    "DoctorSchedule",
    DoctorScheduleSchema
  );

import mongoose, { Schema, Document } from "mongoose";

const TimeWindowSchema = new Schema(
  {
    start: { type: String, required: true }, 
    end: { type: String, required: true },   
  },
  { _id: false }
);

const DoctorScheduleSchema = new Schema(
  {
    doctorId: {
      type: String,
      required: true,
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

    cancelledSlots: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

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
  cancelledSlots: string[];
}

export const DoctorScheduleModel =
  mongoose.models.DoctorSchedule ||
  mongoose.model<DoctorScheduleDocument>(
    "DoctorSchedule",
    DoctorScheduleSchema
  );

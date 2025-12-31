import mongoose, { Schema, Document } from "mongoose";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";

export interface AppointmentDB extends Document {
  doctorId: string;
  patientId: string;
  availabilityId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}

const AppointmentSchema = new Schema<AppointmentDB>(
  {
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    availabilityId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      required: true,
    },
  },
  { timestamps: true }
);

export const AppointmentModel =
  mongoose.model<AppointmentDB>("Appointment", AppointmentSchema);

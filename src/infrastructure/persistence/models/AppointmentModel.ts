import { Schema, model, Types } from "mongoose";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { PaymentStatus } from "@domain/enums/PaymentStatus";

export interface AppointmentDB {
  appointmentId: string;
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  price: number;
  cancellationCharge: number;
  refundAmount: number;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AppointmentSchema = new Schema<AppointmentDB>(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      index: true, 
    },

    doctorId: {
      type: Schema.Types.ObjectId, 
      ref: "Doctor",
      required: true,
      index: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.PENDING,
    },

    price: {
      type: Number,
      required: true,
      default: 0
    },

    cancellationCharge: {
      type: Number,
      default: 0
    },

    refundAmount: {
      type: Number,
      default: 0
    },

    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

AppointmentSchema.index(
  { doctorId: 1, date: 1, startTime: 1, endTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PAYMENT_PENDING] },
    },
  }
);

export const AppointmentModel = model<AppointmentDB>("Appointment", AppointmentSchema);

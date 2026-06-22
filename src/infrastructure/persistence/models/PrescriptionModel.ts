import { Schema, model, Types } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    prescriptionId: {
      type: String,
      required: true,
      unique: true,
    },

    appointmentId: {
      type: String,
      required: true,
      unique: true,
    },

    doctorId: {
      type: Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patientId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    medicines: {
      type: [
        {
          medicineName: {
            type: String,
            required: true,
            trim: true,
          },

          dosage: {
            type: String,
            required: true,
            trim: true,
          },

          frequency: {
            type: String,
            required: true,
            trim: true,
          },

          duration: {
            type: String,
            required: true,
            trim: true,
          },

          instructions: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
      required: true,
      default: [],
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PrescriptionModel =
  model("Prescription", PrescriptionSchema);
import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    reviewId: {
      type: String,
      required: true,
      unique: true,
    },

    appointmentId: {
      type: String,
      required: true,
      unique: true, // one review per appointment
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewModel =
  model("Review", reviewSchema);
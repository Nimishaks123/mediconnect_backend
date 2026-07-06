import { Schema, model } from "mongoose";

const PlatformSettingsSchema = new Schema(
  {
    platformFee: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
    },

    refundPercentage: {
      type: Number,
      required: true,
      default: 75,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const PlatformSettingsModel = model(
  "PlatformSettings",
  PlatformSettingsSchema
);
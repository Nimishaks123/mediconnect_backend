import { z } from "zod";

export const platformSettingsSchema = z.object({
  body: z.object({
    platformFee: z
      .number()
      .positive("Platform fee must be greater than 0"),

    refundPercentage: z
      .number()
      .min(1, "Refund percentage must be at least 1")
      .max(100, "Refund percentage cannot exceed 100"),
  }),
});
import { z } from "zod";

export const getPrescriptionSchema = z.object({
  params: z.object({
    appointmentId: z
      .string()
      .trim()
      .min(1, "Appointment ID is required"),
  }),
});
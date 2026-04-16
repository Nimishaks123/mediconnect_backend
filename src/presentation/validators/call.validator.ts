import { z } from "zod";

export const CheckCallEligibilitySchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export const eligibilityParamsSchema = z.object({
  params: z.object({
    appointmentId: z.string().min(1, "Appointment ID is required")
  })
});

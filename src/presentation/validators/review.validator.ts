import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    appointmentId: z
      .string()
      .trim()
      .min(1, "Appointment ID is required"),

    rating: z
      .number()
      .int("Rating must be a whole number")
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),

    comment: z
      .string()
      .trim()
      .min(5, "Comment must be at least 5 characters")
      .max(500, "Comment cannot exceed 500 characters"),
  }),
  
});
export const getDoctorReviewsSchema = z.object({
  params: z.object({
    doctorId: z
      .string()
      .trim()
      .min(1, "Doctor ID is required"),
  }),
});
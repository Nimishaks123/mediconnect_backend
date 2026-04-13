import { z } from "zod";

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().min(1, "doctorId is required"),
    availabilityId: z.string().min(1, "availabilityId is required"),
  }),
});

import { z } from "zod";

export const GetDoctorAppointmentsSchema = z.object({
  query: z.object({
    page: z.preprocess((val) => val ? parseInt(val as string) : 1, z.number().min(1).default(1)),
    limit: z.preprocess((val) => val ? parseInt(val as string) : 50, z.number().min(1).max(100).default(50)),
  })
});

export const CancelAppointmentByDoctorSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Appointment ID is required"),
  }),
  body: z.object({
    reason: z.enum(['EXPIRED', 'FAILED', 'CANCELLED']).optional(),
  }),
});

export const RescheduleAppointmentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Appointment ID is required"),
  }),
  body: z.object({
    newSlotId: z.string(), // availability id 
  }),
});

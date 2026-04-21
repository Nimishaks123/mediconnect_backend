import { z } from "zod";
import { mongoIdSchema } from "./common";

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: mongoIdSchema,
    slotId: z.string().min(1, "slotId is required"),
    date: z.string().optional(),
  }),
});



export const paramIdSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
});

export const cancelByPatientSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
});

export const createCheckoutSessionSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
});

export const getMyAppointmentsSchema = z.object({
  query: z.object({
    status: z.string().optional(),
  }).optional(),
});



import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  doctorId: z.string(),
  availabilityId: z.string(),
  patientId: z.string(),
});

export const ConfirmAppointmentSchema = z.object({
  appointmentId: z.string(),
});

export const CancelByPatientSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
});

export const CreateCheckoutSessionSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
});

export const GetPatientAppointmentsSchema = z.object({
  patientId: z.string(),
});

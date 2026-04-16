import { z } from "zod";

export const GetDoctorSlotsSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  from: z.string().min(1, "From date is required"),
  to: z.string().min(1, "To date is required"),
});

export const GetSlotsForPatientSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  from: z.string().min(1, "From date is required"),
  to: z.string().min(1, "To date is required"),
});

export const DeleteSlotSchema = z.object({
  slotId: z.string().min(1, "Slot ID is required"),
  doctorUserId: z.string().min(1, "Doctor user ID is required"),
});

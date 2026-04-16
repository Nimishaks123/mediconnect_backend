import { z } from "zod";

export const TimeWindowSchema = z.object({
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
});

export const CreateDoctorScheduleSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  rrule: z.string().min(1, "RRule is required"),
  timeWindows: z.array(TimeWindowSchema).min(1, "At least one time window is required"),
  slotDuration: z.preprocess((val) => Number(val), z.number().min(1, "Slot duration must be greater than 0")),
  validFrom: z.string().min(1, "Valid from date is required"),
  validTo: z.string().min(1, "Valid to date is required"),
  timezone: z.string().optional().default("UTC"),
});

export const GetSlotsWithBookingSchema = z.object({
  doctorUserId: z.string().min(1, "Doctor user ID is required"),
  from: z.string().min(1, "From date is required"),
  to: z.string().min(1, "To date is required"),
});

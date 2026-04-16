import { z } from "zod";

const GenderSchema = z.enum(["MALE", "FEMALE", "OTHER"]).nullable();

export const CreatePatientProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  gender: GenderSchema,
  phone: z.string().min(1, "Phone is required"),
  address: z.string().nullable().optional(),
  profileImage: z.string().nullable().optional(),
  dateOfBirth: z.preprocess((val) => new Date(val as string), z.date()),
  medicalHistory: z.record(z.any()).optional(),
  allergies: z.array(z.string()).optional(),
  bloodGroup: z.string().nullable().optional(),
  emergencyContactName: z.string().nullable().optional(),
  emergencyContactPhone: z.string().nullable().optional(),
});

export const UpdatePatientProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  updates: z.object({
    name: z.string().min(1, "Name is required").optional(),
    gender: GenderSchema.optional(),
    phone: z.string().min(1, "Phone is required").optional(),
    address: z.string().nullable().optional(),
    profileImage: z.string().nullable().optional(),
    dateOfBirth: z.preprocess((val) => val ? new Date(val as string) : null, z.date().nullable()),
    medicalHistory: z.record(z.any()).optional(),
    allergies: z.array(z.string()).optional(),
    bloodGroup: z.string().nullable().optional(),
    emergencyContactName: z.string().nullable().optional(),
    emergencyContactPhone: z.string().nullable().optional(),
  }),
});

export const GetPatientProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

import { z } from "zod";
export const createPatientProfileSchema = z.object({
  body: z.object({
    userId: z.string(),

    dateOfBirth: z.string().datetime().nullable(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable(),

    medicalHistory: z.record(z.string(), z.any()).optional(),
    allergies: z.array(z.string()).optional(),
    bloodGroup: z.string().nullable().optional(),

    emergencyContactName: z.string().nullable().optional(),
    emergencyContactPhone: z.string().nullable().optional()
  })
});

export const updatePatientProfileSchema = z.object({
  params: z.object({
    userId: z.string()
  }),
  body: z.object({
    dateOfBirth: z.string().datetime().nullable().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),

    medicalHistory: z.record(z.string(), z.any()).optional(),
    allergies: z.array(z.string()).optional(),
    bloodGroup: z.string().nullable().optional(),
    emergencyContactName: z.string().nullable().optional(),
    emergencyContactPhone: z.string().nullable().optional(),
  })
});

export const getPatientProfileSchema = z.object({
  params: z.object({
    userId: z.string()
  })
});

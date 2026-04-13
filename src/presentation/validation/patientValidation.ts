import { z } from "zod";

/**
 * STRICT VALIDATION FOR PATIENT PROFILE
 */
export const createPatientProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Phone number must be 10 digits and start with 6-9"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    address: z.string().trim().optional(),
    profileImage: z.string().url().optional(),
    dateOfBirth: z.string().refine((value) => {
      const date = new Date(value);
      const today = new Date();

      if (isNaN(date.getTime())) return false;

      let age = today.getFullYear() - date.getFullYear();
      const m = today.getMonth() - date.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
      }

      return age >= 0 && age < 120;
    }, "Invalid date of birth. Age must be between 0 and 120 years."),
    medicalHistory: z.record(z.string(), z.any()).optional(),
    allergies: z.array(z.string()).optional(),
    bloodGroup: z.string().nullable().optional(),
    emergencyContactName: z.string().trim().nullable().optional(),
    emergencyContactPhone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid emergency contact number. Must be 10 digits starting with 6-9.")
      .nullable()
      .optional()
  })
});

export const updatePatientProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/)
      .optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    address: z.string().trim().optional(),
    profileImage: z.string().url().optional(),
    dateOfBirth: z.string().refine((value) => {
      const date = new Date(value);
      const today = new Date();

      if (isNaN(date.getTime())) return false;

      let age = today.getFullYear() - date.getFullYear();
      const m = today.getMonth() - date.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
      }

      return age >= 0 && age < 120;
    }, "Invalid date of birth.").optional(),
    medicalHistory: z.record(z.string(), z.any()).optional(),
    allergies: z.array(z.string()).optional(),
    bloodGroup: z.string().nullable().optional(),
    emergencyContactName: z.string().trim().nullable().optional(),
    emergencyContactPhone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/)
      .nullable()
      .optional(),
  })
});

export const getPatientProfileSchema = z.object({
  // No params needed if userId comes from auth
});

import { z } from "zod";

export const StartOnboardingSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const CreateDoctorProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  specialty: z.string().min(1, "Specialty is required"),
  qualification: z.string().min(1, "Qualification is required"),
  experience: z.preprocess((val) => Number(val), z.number().min(0, "Experience must be a positive number")),
  consultationFee: z.preprocess((val) => Number(val), z.number().min(0, "Consultation fee must be a positive number")),
  registrationNumber: z.string().min(1, "Registration number is required"),
  aboutMe: z.string().default(""),
});

export const UpdateDoctorProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  updates: z.object({
    specialty: z.string().optional(),
    qualification: z.string().optional(),
    experience: z.preprocess((val) => val !== undefined ? Number(val) : undefined, z.number().min(0).optional()),
    consultationFee: z.preprocess((val) => val !== undefined ? Number(val) : undefined, z.number().min(0).optional()),
    registrationNumber: z.string().optional(),
    aboutMe: z.string().optional(),
    profilePhoto: z.string().url().optional(),
  }),
});

export const UploadDoctorDocumentsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  files: z.object({
    licenseDocument: z.array(z.any()).optional(),
    certifications: z.array(z.any()).optional(),
  }),
  profilePhotoUrl: z.string().url().optional(),
});

export const SubmitForVerificationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const GetDoctorProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

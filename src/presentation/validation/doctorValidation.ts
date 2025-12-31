import { z } from "zod";

// Start onboarding
export const startOnboardingSchema = z.object({});
export const createDoctorProfileSchema = z.object({
  body: z.object({
    userId: z.string(),
    specialty: z.string().min(2),
    qualification: z.string().min(2),
    experience: z.number(),
    consultationFee: z.number(),
    registrationNumber: z.string().min(3),
    aboutMe: z.string().min(10)
  })
});

// Update doctor profile
export const updateDoctorProfileSchema = z.object({
  params: z.object({
    userId: z.string()
  }),
  body: z.object({
    specialty: z.string().optional(),
    qualification: z.string().optional(),
    experience: z.number().optional(),
    consultationFee: z.number().optional(),
    registrationNumber: z.string().optional(),
    aboutMe: z.string().optional(),
    profilePhoto: z.string().optional(),
    licenseDocument: z.string().optional(),
    certifications: z.array(z.string()).optional(),
  })
});

// Upload documents
export const uploadDoctorDocumentsSchema = z.object({
  params: z.object({ userId: z.string() }),
  body: z.object({
    licenseDocument: z.string().optional(),
    certifications: z.array(z.string()).optional(),
    profilePhoto: z.string().optional()
  })
});

// Submit for verification
export const submitForVerificationSchema = z.object({
  params: z.object({
    userId: z.string()
  })
});

// Get doctor profile
export const getDoctorProfileSchema = z.object({
  params: z.object({
    userId: z.string()
  })
});

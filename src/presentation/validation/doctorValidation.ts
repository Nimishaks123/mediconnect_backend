import { z } from "zod";

/**
 * 1️⃣ Start Onboarding Schema
 */
export const startOnboardingSchema = z.object({
  body: z.object({}).optional(),
});

/**
 * 2️⃣ Update Doctor Profile Schema
 */
export const updateDoctorProfileSchema = z.object({
  body: z.object({
    specialty: z.string().trim().min(2, "Specialty is required").optional(),
    qualification: z.string().trim().min(2, "Qualification is required").optional(),
    experience: z.coerce.number().min(0, "Experience must be between 0 and 60").max(60).optional(),
    consultationFee: z.coerce.number().min(100, "Fee must be between ₹100 and ₹10000").max(10000).optional(),
    registrationNumber: z.string().trim().min(5, "Invalid registration number").regex(/^[A-Z0-9-]+$/, "Register number must be alphanumeric or hyphen").optional(),
    aboutMe: z.string().trim().min(20, "At least 20 characters required").max(500, "Maximum 500 characters allowed").optional(),
    profilePhoto: z
      .string()
      .trim()
      .url("Invalid profile photo URL")
      .refine((url) => url.includes("res.cloudinary.com"), "Only Cloudinary URLs are allowed for profile photo")
      .optional(),
  }),
});

/**
 * 3️⃣ Upload Documents Schema
 */
export const uploadDoctorDocumentsSchema = z.object({
  body: z.object({
    profilePhotoUrl: z
      .string()
      .trim()
      .url("Invalid profile photo URL")
      .refine((url) => url.includes("res.cloudinary.com"), "Only Cloudinary URLs are allowed for profile photo")
      .optional(),
  }).passthrough(),
});

/**
 * 4️⃣ Submit For Verification Schema
 */
export const submitForVerificationSchema = z.object({
  body: z.object({}).optional(),
});

/**
 * 5️⃣ Get Doctor Profile Schema
 */
export const getDoctorProfileSchema = z.object({
  body: z.object({}).optional(),
});

// SLOTS VALIDATION
export const getDoctorSlotsSchema = z.object({
  query: z.object({
    from: z.string(),
    to: z.string(),
  }),
});

export const getPatientSlotsSchema = z.object({
  params: z.object({
    doctorId: z.string().min(1, "Doctor ID is required").refine(id => id !== "undefined", {
      message: "Invalid doctor ID (undefined)",
    }),
  }),
  query: z.object({
    from: z.string(),
    to: z.string(),
  }),
});

export const deleteSlotSchema = z.object({
  params: z.object({
    slotId: z.string().min(1, "Invalid Slot ID"),
  }),
});

// SCHEDULE VALIDATION
export const createDoctorScheduleSchema = z.object({
  body: z.object({
    rrule: z.string(),
    timeWindows: z.array(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    ).min(1, "At least one time window is required"),
    slotDuration: z.coerce.number().min(5, "Minimum slot duration is 5 minutes").refine((val) => val % 5 === 0, {
      message: "Slot duration must be a multiple of 5 minutes",
    }),
    validFrom: z.string(),
    validTo: z.string(),
    timezone: z.string().optional(),
  }).refine((data) => {
    const from = new Date(data.validFrom);
    const to = new Date(data.validTo);
    return from <= to;
  }, {
    message: "validFrom must be before or equal to validTo",
    path: ["validTo"],
  }),
});

export const getSlotsWithBookingSchema = z.object({
  query: z.object({
    from: z.string(),
    to: z.string(),
  }).refine((data) => {
    const from = new Date(data.from);
    const to = new Date(data.to);
    return from <= to;
  }, {
    message: "from must be before or equal to to",
    path: ["to"],
  }),
});

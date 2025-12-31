import { z } from "zod";
export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(3),
  }),
});

export const approveDoctorSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
  }),
});

/**
 * 3️⃣ Reject Doctor Schema
 */
export const rejectDoctorSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
    reason: z.string().min(3, "Rejection reason must be at least 3 characters"),
  }),
});

/**
 * 4️⃣ Block User Schema
 */
export const blockUserSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
    reason: z.string().optional(),
  }),
});

/**
 * 5️⃣ Unblock User Schema
 */
export const unblockUserSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
  }),
});
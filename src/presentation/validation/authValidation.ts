import { z } from "zod";

// Signup
export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    password: z.string().min(6),
    role: z.enum(["PATIENT", "DOCTOR"])
  })
});

// Verify OTP
export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    code: z.string().length(6)
  })
});

// Resend OTP
export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email()
  })
});

// Login
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});
export const forgotPasswordSendOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});
export const forgotPasswordVerifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    code: z.string().length(6),
  }),
});
export const forgotPasswordResetSchema = z.object({
  body: z.object({
    email: z.string().email(),
    newPassword: z.string().min(6),
  }),
});

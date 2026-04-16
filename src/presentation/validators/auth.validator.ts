import { z } from "zod";
import { UserRole } from "@domain/enums/UserRole";

export const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(1, "Phone number is required").optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(UserRole),
}).transform((data) => ({
  ...data,
  phoneNumber: data.phoneNumber || data.phone,
}));

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z.string().min(1, "OTP code is required").optional(),
  otp: z.string().min(1, "OTP code is required").optional(),
}).transform((data) => ({
  email: data.email,
  code: data.code || data.otp || "",
}));

export const ResendOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const LoginWithGoogleSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
  role: z.string().optional(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const SendForgotPasswordOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const VerifyForgotPasswordOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z.string().min(1, "OTP code is required").optional(),
  otp: z.string().min(1, "OTP code is required").optional(),
}).transform((data) => ({
  email: data.email,
  code: data.code || data.otp || "",
}));

export const ResetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
}).transform((data) => ({
  email: data.email,
  newPassword: data.newPassword || data.password || "",
}));

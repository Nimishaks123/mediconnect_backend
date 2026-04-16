import { z } from "zod";

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const AdminDoctorsQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
  limit: z.preprocess((val) => Number(val), z.number().min(1).max(50).default(10)),
  search: z.string().optional(),
  sort: z.enum(["NEWEST", "OLDEST"]).default("NEWEST"),
});

export const ApproveDoctorSchema = z.object({
  userId: z.string(),
  adminId: z.string(),
});

export const RejectDoctorSchema = z.object({
  userId: z.string(),
  reason: z.string().min(1),
  adminId: z.string(),
});

export const BlockUnblockUserSchema = z.object({
  userId: z.string(),
  adminId: z.string(),
});

export const GetAllUsersSchema = z.object({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
  limit: z.preprocess((val) => Number(val), z.number().min(1).max(6).default(6)),
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.enum(["ACTIVE", "BLOCKED"]).optional(),
});

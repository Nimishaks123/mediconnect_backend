import { z } from "zod";

// Validation schema for userId parameter
export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid user ID format")
  })
});

export const AdminWalletQuerySchema = z.object({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
  limit: z.preprocess((val) => Number(val), z.number().min(1).max(100).default(10)),
  search: z.string().optional(),
  sort: z.enum(["NEWEST", "OLDEST"]).default("NEWEST"),
});

export const AdminWalletTransactionQuerySchema = z.object({
  userId: z.string(),
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
  limit: z.preprocess((val) => Number(val), z.number().min(1).max(100).default(10)),
  type: z.enum(["CREDIT", "DEBIT"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["NEWEST", "OLDEST"]).default("NEWEST"),
});

import { z } from "zod";

// PARAMS schema
export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  }),
});

// QUERY schema for wallets
export const AdminWalletQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    sort: z.enum(["NEWEST", "OLDEST"]).default("NEWEST"),
  }),
});

// QUERY + PARAMS schema for transactions
export const AdminWalletTransactionSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  }),
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    type: z.enum(["CREDIT", "DEBIT"]).optional(),
    search: z.string().optional(),
    sort: z.enum(["NEWEST", "OLDEST"]).default("NEWEST"),
  }),
});
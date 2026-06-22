import { z } from "zod";

export const GetUserWalletSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const walletTopupSchema = z.object({
  body: z.object({
    amount: z.coerce
      .number()
      .positive("Amount must be greater than 0")
      .min(100, "Minimum topup amount is ₹100")
      .max(50000, "Maximum topup amount is ₹50000"),
  }),
});
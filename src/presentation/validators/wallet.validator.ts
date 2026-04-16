import { z } from "zod";

export const GetUserWalletSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

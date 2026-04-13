import { z } from "zod";

export const paramIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID parameter is required"),
  }),
});

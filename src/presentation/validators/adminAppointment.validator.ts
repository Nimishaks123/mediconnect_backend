import { z } from "zod";

export const AdminAppointmentsQuerySchema = z.object({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
  limit: z.preprocess((val) => Number(val), z.number().min(1).max(50).default(10)),
  type: z.enum(["UPCOMING", "PAST", "RECENT"]).default("UPCOMING"),
  status: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["LATEST", "OLDEST"]).default("LATEST"),
});

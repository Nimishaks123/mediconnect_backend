import { z } from "zod";

export const AdminAppointmentsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  type: z.enum(["UPCOMING", "PAST", "RECENT"]).default("UPCOMING"),
  status: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["LATEST", "OLDEST"]).default("LATEST"),
});
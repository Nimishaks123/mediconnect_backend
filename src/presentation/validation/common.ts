import { z } from "zod";

/**
 * Common schema parts to be reused across different validation schemas.
 * Ensures consistency and follows DRY principle.
 */

export const idSchema = z.string().min(1, "Required");

export const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const userIdSchema = mongoIdSchema;
export const appointmentIdSchema = mongoIdSchema;
export const doctorIdSchema = mongoIdSchema;
export const availabilityIdSchema = mongoIdSchema;

export const paginationSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)");

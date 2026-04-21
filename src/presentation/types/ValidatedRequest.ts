import { Request } from "express";
import { z } from "zod";

/**
 * Generic type for validated Express requests.
 * TSchema should be a Zod object containing body, query, and/or params.
 */
export interface ValidatedRequest<TSchema extends z.ZodObject<any, any>> extends Request<any, any, any, any> {



  body: z.infer<TSchema>["body"];
  query: z.infer<TSchema>["query"];
  params: z.infer<TSchema>["params"];
  user?: {
    id: string;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
    email?: string;
  };
}

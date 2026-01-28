import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
    email?: string;
  };
}

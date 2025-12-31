import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      role: "PATIENT" | "DOCTOR" | "ADMIN";
      email?: string;
    };
  }
}

// src/presentation/routes/publicDoctorRoutes.ts
import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController";
import { authMiddleware } from "../middlewares/authMiddleware";

export function publicDoctorRoutes(
  doctorController: DoctorController
) {
  const router = Router();

  // view verified doctors
  router.get(
    "/verified",
    authMiddleware, // user must be logged in
    doctorController.getVerifiedDoctors
  );

  return router;
}

import { Router, RequestHandler } from "express";
import { DoctorController } from "../controllers/DoctorController";

export function publicDoctorRoutes(
  doctorController: DoctorController,
  authMiddleware: RequestHandler
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

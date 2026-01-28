import { Router } from "express";
import { DoctorScheduleController } from "../controllers/DoctorScheduleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAuth } from "../middlewares/requireAuth";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export function doctorScheduleRoutes(
  controller: DoctorScheduleController
) {
  const router = Router();

 router.post(
  "/",
  authMiddleware,
  requireAuth,
  (req, res, next) => controller.create(req as AuthenticatedRequest, res, next)
);


  return router;
}

import { Router } from "express";
import { DoctorScheduleController } from "../controllers/DoctorScheduleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAuth } from "../middlewares/requireAuth";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createDoctorScheduleSchema,
  getSlotsWithBookingSchema
} from "../validation/doctorValidation";

export function doctorScheduleRoutes(
  controller: DoctorScheduleController
) {
  const router = Router();

  router.post(
    "/",
    authMiddleware,
    requireAuth,
    validateRequest(createDoctorScheduleSchema),
    controller.create
  );

  router.get(
    "/slots-with-booking",
    authMiddleware,
    validateRequest(getSlotsWithBookingSchema),
    controller.getSlotsWithBooking
  );

  return router;
}

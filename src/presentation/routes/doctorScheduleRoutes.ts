import { Router, RequestHandler } from "express";
import { DoctorScheduleController } from "../controllers/DoctorScheduleController";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { requireDoctor } from "../middlewares/roleMiddleware";
import {
  createDoctorScheduleSchema,
  getSlotsWithBookingSchema
} from "../validation/doctorValidation";

export function doctorScheduleRoutes(
  controller: DoctorScheduleController,
  authMiddleware: RequestHandler
) {
  const router = Router();

  // Enforce Doctor only for all schedule routes
  router.use(...requireDoctor(authMiddleware));

  router.post(
    "/",
    validateRequest(createDoctorScheduleSchema),
    controller.create
  );

  router.get(
    "/slots-with-booking",
    validateRequest(getSlotsWithBookingSchema),
    controller.getSlotsWithBooking
  );

  return router;
}


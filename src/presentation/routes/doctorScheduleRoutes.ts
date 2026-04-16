import { Router, RequestHandler } from "express";
import { DoctorScheduleController } from "../controllers/DoctorScheduleController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createDoctorScheduleSchema,
  getSlotsWithBookingSchema
} from "../validation/doctorValidation";

export function doctorScheduleRoutes(
  controller: DoctorScheduleController,
  authMiddleware: RequestHandler
) {
  const router = Router();

  router.use(authMiddleware);

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

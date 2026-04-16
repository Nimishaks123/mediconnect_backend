import { Router, RequestHandler } from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { z } from "zod";
import { validateRequest } from "../middlewares/validateRequest";

const paramIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID parameter is required"),
  }),
});

export function patientAppointmentRoutes(controller: AppointmentController, authMiddleware: RequestHandler) {
  const router = Router();
  router.get(
    "/appointments",
    authMiddleware,
    allowRoles(UserRole.PATIENT),
    controller.getMyAppointments
  );

  router.patch(
    "/appointments/:id/cancel",
    authMiddleware,
    allowRoles(UserRole.PATIENT),
    validateRequest(paramIdSchema),
    controller.cancelByPatient
  );

  return router;
}

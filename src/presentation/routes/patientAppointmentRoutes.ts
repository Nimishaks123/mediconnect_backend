import { Router } from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { z } from "zod";
import { validateRequest } from "../middlewares/validateRequest";

const paramIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID parameter is required"),
  }),
});

export function patientAppointmentRoutes(controller: AppointmentController) {
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

import { Router } from "express";
import { AdminAppointmentController } from "../controllers/AdminAppointmentController";

export function adminAppointmentRoutes(controller: AdminAppointmentController) {
  const router = Router();

  router.get("/", controller.getAppointments);
  router.get("/:id", controller.getAppointmentDetails);

  return router;
}

import { Router, RequestHandler } from "express";
import { AdminAppointmentController } from "../controllers/AdminAppointmentController";
import { requireAdmin } from "../middlewares/roleMiddleware";

export function adminAppointmentRoutes(controller: AdminAppointmentController, authMiddleware: RequestHandler) {
  const router = Router();
  
  // Enforce Admin only for all routes
  router.use(...requireAdmin(authMiddleware));

  router.get("/", controller.getAppointments);
  router.get("/:id", controller.getAppointmentDetails);

  return router;
}


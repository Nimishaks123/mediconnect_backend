import { Router, RequestHandler } from "express";
import { AdminAppointmentController } from "../controllers/AdminAppointmentController";
import { requireAdmin } from "../middlewares/roleMiddleware";
import { AdminAppointmentsQuerySchema } from "../validators/adminAppointment.validator";
import { validateRequest } from "@presentation/middlewares/validateRequest";
export function adminAppointmentRoutes(controller: AdminAppointmentController, authMiddleware: RequestHandler) {
  const router = Router();
  router.use(...requireAdmin(authMiddleware));

  router.get("/",validateRequest(AdminAppointmentsQuerySchema), controller.getAppointments);
  router.get("/:id", controller.getAppointmentDetails);

  return router;
}


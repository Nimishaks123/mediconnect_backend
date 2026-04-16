import { Router } from "express";
import { AdminAppointmentController } from "../controllers/AdminAppointmentController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { ITokenService } from "@application/interfaces/auth/ITokenService";

export function adminAppointmentRoutes(controller: AdminAppointmentController, tokenService: ITokenService) {
  const router = Router();
  router.use(createAuthMiddleware(tokenService));
  router.use(allowRoles(UserRole.ADMIN));

  router.get("/", controller.getAppointments);
  router.get("/:id", controller.getAppointmentDetails);

  return router;
}

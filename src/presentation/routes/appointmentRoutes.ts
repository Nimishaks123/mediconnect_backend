import { Router, RequestHandler } from "express";
import { AppointmentController } from "@presentation/controllers/AppointmentController";
import { allowRoles } from "@presentation/middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { validateRequest } from "../middlewares/validateRequest";
import { createAppointmentSchema, paramIdSchema } from "@presentation/validation/appointmentValidation";


export function appointmentRoutes(
  appointmentController: AppointmentController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  const requirePatient = [authMiddleware, allowRoles(UserRole.PATIENT)];
  const requireAdmin = [authMiddleware, allowRoles(UserRole.ADMIN)];

  // Create appointment (payment pending)
  router.post(
    "/",
    ...requirePatient,
    validateRequest(createAppointmentSchema),
    appointmentController.create
  );

  // Create Stripe Checkout session
  router.post(
    "/:id/checkout",
    ...requirePatient,
    validateRequest(paramIdSchema),
    appointmentController.createCheckoutSession
  );

  router.post(
    "/:id/confirm",
    ...requireAdmin,
    validateRequest(paramIdSchema),
    appointmentController.confirm
  );

  router.get(
    "/me",
    ...requirePatient,
    appointmentController.getMyAppointments
  );

  return router;
}

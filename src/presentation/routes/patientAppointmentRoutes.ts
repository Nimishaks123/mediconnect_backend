import { Router, RequestHandler } from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { requirePatient } from "../middlewares/roleMiddleware";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { cancelByPatientSchema, getMyAppointmentsSchema } from "@presentation/validation/appointmentValidation";



export function patientAppointmentRoutes(controller: AppointmentController, authMiddleware: RequestHandler) {
  const router = Router();
  
  router.get(
    "/appointments",
    ...requirePatient(authMiddleware),
    validateRequest(getMyAppointmentsSchema),
    controller.getMyAppointments
  );

  router.patch(
    "/appointments/:id/cancel",
    ...requirePatient(authMiddleware),
    validateRequest(cancelByPatientSchema),
    controller.cancelByPatient
  );


  return router;
}

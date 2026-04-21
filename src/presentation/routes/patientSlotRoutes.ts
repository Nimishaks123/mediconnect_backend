import { Router, RequestHandler } from "express";
import { DoctorSlotController } from "../controllers/DoctorSlotController";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { getPatientSlotsSchema } from "../validation/doctorValidation";
import { requirePatient } from "../middlewares/roleMiddleware";

export function patientSlotRoutes(controller: DoctorSlotController, authMiddleware: RequestHandler) {
  const router = Router();

  router.get(
    "/doctors/slots/:doctorId",
    ...requirePatient(authMiddleware),
    validateRequest(getPatientSlotsSchema),
    controller.getSlotsForPatient
  );

  return router;
}
import { Router } from "express";
import { DoctorSlotController } from "../controllers/DoctorSlotController";
import { validateRequest } from "../middlewares/validateRequest";
import { getPatientSlotsSchema } from "../validation/doctorValidation";

export function patientSlotRoutes(controller: DoctorSlotController) {
  const router = Router();

  router.get(
    "/doctors/slots/:doctorId",
    validateRequest(getPatientSlotsSchema),
    controller.getSlotsForPatient
  );

  return router;
}
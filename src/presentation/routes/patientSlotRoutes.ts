import { Router } from "express";
import { DoctorSlotController } from "../controllers/DoctorSlotController";
import { requireAuth } from "../middlewares/requireAuth";
import { allowRoles } from "../middlewares/roleMiddleware";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export function patientSlotRoutes(controller: DoctorSlotController) {
  const router = Router();

  //  Patient → selected doctor's slots
  router.get(
    "/doctors/:doctorId/slots",
    requireAuth,
    allowRoles("PATIENT"),
    (req, res, next) =>
      controller.getSlotsForPatient(
        req as AuthenticatedRequest,
        res,
        next
      )
  );

  return router;
}

import { Router } from "express";
import { DoctorSlotController } from "../controllers/DoctorSlotController";
import { requireAuth } from "../middlewares/requireAuth";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { validateRequest } from "../middlewares/validateRequest";
import { getDoctorSlotsSchema, deleteSlotSchema } from "../validation/doctorValidation";

export function doctorSlotRoutes(controller: DoctorSlotController) {
  const router = Router();

  // Doctor → slots
  router.get(
    "/slots",
    requireAuth,
    allowRoles(UserRole.DOCTOR),
    validateRequest(getDoctorSlotsSchema),
    controller.getDoctorSlots
  );

  // Doctor -> delete a slot (schedule)
  router.delete(
    "/slots/:slotId",
    requireAuth,
    allowRoles(UserRole.DOCTOR),
    validateRequest(deleteSlotSchema),
    controller.deleteSlotController
  );

  return router;
}


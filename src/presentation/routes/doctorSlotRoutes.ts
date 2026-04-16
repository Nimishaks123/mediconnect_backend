import { Router, RequestHandler } from "express";
import { DoctorSlotController } from "../controllers/DoctorSlotController";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { validateRequest } from "../middlewares/validateRequest";
import { getDoctorSlotsSchema, deleteSlotSchema } from "../validation/doctorValidation";

export function doctorSlotRoutes(controller: DoctorSlotController, authMiddleware: RequestHandler) {
  const router = Router();
  router.use(authMiddleware, allowRoles(UserRole.DOCTOR));

  router.get(
    "/slots",
    validateRequest(getDoctorSlotsSchema),
    controller.getDoctorSlots
  );

  router.delete(
    "/slots/:slotId",
    validateRequest(deleteSlotSchema),
    controller.deleteSlotController
  );

  return router;
}


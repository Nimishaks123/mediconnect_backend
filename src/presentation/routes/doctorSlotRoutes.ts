import { Router, RequestHandler } from "express";
import { DoctorSlotController } from "../controllers/DoctorSlotController";
import { requireDoctor } from "../middlewares/roleMiddleware";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { getDoctorSlotsSchema, deleteSlotSchema } from "../validation/doctorValidation";

export function doctorSlotRoutes(controller: DoctorSlotController, authMiddleware: RequestHandler) {
  const router = Router();
  
  // Enforce Doctor only for all slot routes
  router.use(...requireDoctor(authMiddleware));

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



import { Router } from "express";
import { DoctorSlotController } from "../controllers/DoctorSlotController";
import { requireAuth } from "../middlewares/requireAuth";
import { allowRoles } from "../middlewares/roleMiddleware";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";

export function doctorSlotRoutes(controller: DoctorSlotController) {
  const router = Router();

  //  Doctor → slots
  router.get(
    "/slots",
    requireAuth,
    allowRoles("DOCTOR"),
    (req, res, next) =>
      controller.getDoctorSlots(
        req as AuthenticatedRequest,
        res,
        next
      )
  );

  
  return router;
}

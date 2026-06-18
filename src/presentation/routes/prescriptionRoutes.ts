import { Router, RequestHandler } from "express";

import { PrescriptionController } from "../controllers/PrescriptionController";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { getPrescriptionSchema } from "@presentation/validators/prescription.validator";
import { requireDoctor } from "@presentation/middlewares/roleMiddleware";

export function prescriptionRoutes(
  prescriptionController: PrescriptionController,
  authMiddleware: RequestHandler
) {
  const router = Router();



  router.post(
    "/",...requireDoctor(authMiddleware),
    prescriptionController.create
  );
  router.get(
  "/:appointmentId",
  authMiddleware,validateRequest(getPrescriptionSchema),
  prescriptionController.getPrescription
);

  return router;
}
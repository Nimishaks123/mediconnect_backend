import { Router, RequestHandler } from "express";
import { PatientWalletController } from "../controllers/PatientWalletController";
import { requirePatient } from "../middlewares/roleMiddleware";

export function patientWalletRoutes(controller: PatientWalletController, authMiddleware: RequestHandler) {
  const router = Router();

  router.get(
    "/wallet",
    ...requirePatient(authMiddleware),
    controller.getWallet
  );

  return router;
}


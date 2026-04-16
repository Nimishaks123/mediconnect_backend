import { Router, RequestHandler } from "express";
import { PatientWalletController } from "../controllers/PatientWalletController";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";

export function patientWalletRoutes(controller: PatientWalletController, authMiddleware: RequestHandler) {
  const router = Router();

  router.get(
    "/wallet",
    authMiddleware,
    allowRoles(UserRole.PATIENT),
    controller.getWallet
  );

  return router;
}

import { Router } from "express";
import { PatientWalletController } from "../controllers/PatientWalletController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";

export function patientWalletRoutes(controller: PatientWalletController) {
  const router = Router();

  router.get(
    "/wallet",
    authMiddleware,
    allowRoles(UserRole.PATIENT),
    controller.getWallet
  );

  return router;
}

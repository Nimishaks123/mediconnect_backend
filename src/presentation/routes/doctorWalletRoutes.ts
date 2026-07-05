import { Router, RequestHandler } from "express";

import { DoctorWalletController }
from "../controllers/DoctorWalletController";

import { requireDoctor }
from "../middlewares/roleMiddleware";

export function doctorWalletRoutes(
  controller: DoctorWalletController,
  authMiddleware: RequestHandler
) {

  const router = Router();

  router.get(
    "/wallet",
    ...requireDoctor(authMiddleware),
    controller.getWallet
  );

  router.get(
    "/wallet/transactions",
    ...requireDoctor(authMiddleware),
    controller.getTransactions
  );

  return router;
}
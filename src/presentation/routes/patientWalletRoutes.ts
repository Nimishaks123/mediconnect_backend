import { Router, RequestHandler } from "express";

import { PatientWalletController }
from "../controllers/PatientWalletController";

import { requirePatient }
from "../middlewares/roleMiddleware";

import { validateRequest }
from "../middlewares/validateRequest";

import {
  walletTopupSchema,
} from "../validators/wallet.validator";

export function patientWalletRoutes(
  controller: PatientWalletController,
  authMiddleware: RequestHandler
) {

  const router = Router();

  router.get(
    "/wallet",
    ...requirePatient(authMiddleware),
    controller.getWallet
  );

  router.post(
    "/topup",
    ...requirePatient(authMiddleware),
    validateRequest(walletTopupSchema),
    controller.topupWallet
  );
  router.get(
  "/wallet/transactions",
  ...requirePatient(authMiddleware),
  controller.getTransactions
);

  return router;
}
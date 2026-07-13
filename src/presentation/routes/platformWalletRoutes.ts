import { Router, RequestHandler } from "express";
import { PlatformWalletController } from "@presentation/controllers/PlatformWalletController";
import { requireAdmin } from "@presentation/middlewares/roleMiddleware";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { platformWalletTransactionQuerySchema } from "@presentation/validators/platformWallet.validator";

export function platformWalletRoutes(
  controller: PlatformWalletController,
  authMiddleware: RequestHandler
) {
  const router = Router();

  router.get(
    "/platform-wallet",
    ...requireAdmin(authMiddleware),
    controller.getWallet
  );

  router.get(
    "/platform-wallet/transactions",
    ...requireAdmin(authMiddleware),
    validateRequest(platformWalletTransactionQuerySchema),
    controller.getTransactions
  );

  return router;
}
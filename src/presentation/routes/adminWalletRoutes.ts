import { Router, RequestHandler } from "express";
import { AdminWalletController } from "../controllers/AdminWalletController";
import { requireAdmin } from "../middlewares/roleMiddleware";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { AdminWalletQuerySchema,AdminWalletTransactionSchema } from "../validators/adminWallet.validator";

export function adminWalletRoutes(controller: AdminWalletController, authMiddleware: RequestHandler) {
  const router = Router();
  
  router.use(...requireAdmin(authMiddleware));
  router.get(
  "/",
  validateRequest(AdminWalletQuerySchema),
  controller.getWallets
);

router.get(
  "/:userId/transactions",
  validateRequest(AdminWalletTransactionSchema),
  controller.getTransactions
);

  return router;
}


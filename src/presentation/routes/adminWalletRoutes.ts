import { Router } from "express";
import { AdminWalletController } from "../controllers/AdminWalletController";

export function adminWalletRoutes(controller: AdminWalletController) {
  const router = Router();

  router.get("/", controller.getWallets);
  router.get("/:userId/transactions", controller.getTransactions);

  return router;
}

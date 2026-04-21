import { Router, RequestHandler } from "express";
import { AdminWalletController } from "../controllers/AdminWalletController";
import { requireAdmin } from "../middlewares/roleMiddleware";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { userIdParamSchema } from "../validators/adminWallet.validator";

export function adminWalletRoutes(controller: AdminWalletController, authMiddleware: RequestHandler) {
  const router = Router();
  
  router.use(...requireAdmin(authMiddleware));

  router.get("/", controller.getWallets);
  router.get("/:userId/transactions", 
    validateRequest(userIdParamSchema),
    controller.getTransactions
  );

  return router;
}


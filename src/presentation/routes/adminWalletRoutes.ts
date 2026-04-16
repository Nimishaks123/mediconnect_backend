import { Router, RequestHandler } from "express";
import { AdminWalletController } from "../controllers/AdminWalletController";
import { allowRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "@application/constants/UserRole";
import { validateRequest } from "../middlewares/validateRequest";
import { userIdParamSchema } from "../validators/adminWallet.validator";

export function adminWalletRoutes(controller: AdminWalletController, authMiddleware: RequestHandler) {
  const router = Router();
  router.use(authMiddleware);
  router.use(allowRoles(UserRole.ADMIN));

  router.get("/", controller.getWallets);
  router.get("/:userId/transactions", 
    validateRequest(userIdParamSchema),
    controller.getTransactions
  );

  return router;
}

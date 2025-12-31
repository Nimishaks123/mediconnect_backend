import { AdminController } from "../controllers/AdminController";
import { adminLoginSchema } from "@presentation/validation/adminValidation";
import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
export function adminPublicRoutes(adminController: AdminController) {
  const router = Router();

  router.post(
    "/login",
    validateRequest(adminLoginSchema),
    adminController.login
  );

  return router;
}

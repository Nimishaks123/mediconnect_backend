import { Router } from "express";
import { UploadController } from "../controllers/UploadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAuth } from "../middlewares/requireAuth";

export function uploadRoutes(uploadController: UploadController) {
  const router = Router();

  router.get(
    "/signature",
    authMiddleware,
    requireAuth,
    uploadController.getSignature
  );

  return router;
}

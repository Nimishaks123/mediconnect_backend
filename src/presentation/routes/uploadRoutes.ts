import { Router, RequestHandler } from "express";
import { UploadController } from "../controllers/UploadController";
import { requireAuth } from "../middlewares/requireAuth";

export function uploadRoutes(uploadController: UploadController, authMiddleware: RequestHandler) {
  const router = Router();

  router.get(
    "/signature",
    authMiddleware,
    requireAuth,
    uploadController.getSignature
  );

  return router;
}

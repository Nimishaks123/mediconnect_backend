import { Router, RequestHandler } from "express";
import { UploadController } from "../controllers/UploadController";

export function uploadRoutes(uploadController: UploadController, authMiddleware: RequestHandler) {
  const router = Router();

  router.get(
    "/signature",
    authMiddleware,
    uploadController.getSignature
  );

  return router;
}


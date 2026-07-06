import { Router, RequestHandler } from "express";

import { PlatformSettingsController }
from "../controllers/PlatformSettingsController";

import { requireAdmin }
from "../middlewares/roleMiddleware";

import { validateRequest }
from "../middlewares/validateRequest";

import {
  platformSettingsSchema,
} from "../validators/platformSettings.validator";

export function adminSettingsRoutes(
  controller: PlatformSettingsController,
  authMiddleware: RequestHandler
) {

  const router = Router();

  router.get(
    "/settings",
    ...requireAdmin(authMiddleware),
    controller.getSettings
  );

  router.patch(
    "/settings",
    ...requireAdmin(authMiddleware),
    validateRequest(platformSettingsSchema),
    controller.updateSettings
  );

  return router;
}
import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../middlewares/authMiddleware";

export function notificationRoutes(controller: NotificationController) {
  const router = Router();

  router.use(authMiddleware);

  router.get("/", controller.getUserNotifications);
  router.patch("/:id/read", controller.markAsRead);

  return router;
}

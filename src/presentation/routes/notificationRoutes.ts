import { Router, RequestHandler } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import {
  GetUserNotificationsSchema,
  MarkNotificationAsReadSchema
} from "../validators/notification.validator";

export function notificationRoutes(controller: NotificationController, authMiddleware: RequestHandler) {
  const router = Router();

  router.get(
    "/",
    authMiddleware,
    validateRequest(GetUserNotificationsSchema),
    controller.getUserNotifications
  );
  
  router.patch(
    "/:id/read",
    authMiddleware,
    validateRequest(MarkNotificationAsReadSchema),
    controller.markAsRead
  );

  return router;
} 


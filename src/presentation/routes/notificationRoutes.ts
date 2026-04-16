import { Router, RequestHandler } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  GetUserNotificationsSchema,
  MarkNotificationAsReadSchema
} from "../validators/notification.validator";

export function notificationRoutes(controller: NotificationController, authMiddleware: RequestHandler) {
  const router = Router();

  router.use(authMiddleware);

  router.get(
    "/",
    validateRequest(GetUserNotificationsSchema),
    controller.getUserNotifications
  );
  
  router.patch(
    "/:id/read",
    validateRequest(MarkNotificationAsReadSchema),
    controller.markAsRead
  );

  return router;
} 

import { Router, RequestHandler } from "express";
import { ChatController } from "../controllers/ChatController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  SendMessageSchema,
  GetMessagesSchema,
  GetConversationsSchema,
  MarkAsReadSchema
} from "../validators/chat.validator";

export const chatRoutes = (chatController: ChatController, authMiddleware: RequestHandler) => {
  const router = Router();

  router.use(authMiddleware);

  router.post("/messages", validateRequest(SendMessageSchema), chatController.sendMessage);
  router.get("/messages/:conversationId", validateRequest(GetMessagesSchema), chatController.getMessages);
  router.get("/conversations", validateRequest(GetConversationsSchema), chatController.getConversations);
  router.patch("/read/:conversationId", validateRequest(MarkAsReadSchema), chatController.markAsRead);

  return router;
};


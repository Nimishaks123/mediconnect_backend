import { SendMessageUseCase } from "@application/usecases/chat/SendMessageUseCase";
import { GetMessagesUseCase } from "@application/usecases/chat/GetMessagesUseCase";
import { MarkConversationAsReadUseCase } from "@application/usecases/chat/MarkConversationAsReadUseCase";
import { GetConversationListUseCase } from "@application/usecases/chat/GetConversationListUseCase";
import { messageRepository } from "./repositories";
import { notificationService } from "./services";

export const sendMessageUseCase = new SendMessageUseCase(
  messageRepository,
  notificationService
);

export const getMessagesUseCase = new GetMessagesUseCase(messageRepository);

export const markConversationAsReadUseCase = new MarkConversationAsReadUseCase(messageRepository);

export const getConversationListUseCase = new GetConversationListUseCase(messageRepository);

import { Message } from "@domain/entities/Message";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { INotificationService } from "@application/interfaces/services/INotificationService";

export interface SendMessageDTO {
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
}

export class SendMessageUseCase {
  constructor(
    private readonly messageRepo: IMessageRepository,
    private readonly socketService: INotificationService
  ) {}

  async execute(dto: SendMessageDTO): Promise<Message> {
    const message = Message.create(
      dto.senderId,
      dto.receiverId,
      dto.conversationId,
      dto.content
    );

    const savedMessage = await this.messageRepo.save(message);

    // Emit real-time message via socket
    this.socketService.notifyUser(dto.receiverId, "new_message", {
      id: savedMessage.getId(),
      senderId: savedMessage.getSenderId(),
      receiverId: savedMessage.getReceiverId(),
      conversationId: savedMessage.getConversationId(),
      content: savedMessage.getContent(),
      createdAt: savedMessage.getCreatedAt(),
      status: savedMessage.getStatus()
    });

    return savedMessage;
  }
}

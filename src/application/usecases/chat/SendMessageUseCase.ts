import { Message }
from "@domain/entities/Message";

import { IMessageRepository }
from "@domain/interfaces/IMessageRepository";

import { INotificationService }
from "@application/interfaces/services/INotificationService";

export interface SendMessageDTO {

  senderId: string;

  receiverId: string;

  conversationId: string;

  content?: string;

  attachmentUrl?: string;

  attachmentType?: string;
}

export class SendMessageUseCase {

  constructor(

    private readonly messageRepo:
      IMessageRepository,

    private readonly socketService:
      INotificationService
  ) {}

  async execute(
    dto: SendMessageDTO
  ): Promise<Message> {

    const message =
      Message.create(

        dto.senderId,

        dto.receiverId,

        dto.conversationId,

        dto.content || "",

        dto.attachmentUrl,

        dto.attachmentType
      );

    const savedMessage =
      await this.messageRepo.save(
        message
      );

    // REALTIME SOCKET EVENT
    this.socketService.notifyUser(

      dto.receiverId,

      "new_message",

      {

        id:
          savedMessage.getId(),

        senderId:
          savedMessage.getSenderId(),

        receiverId:
          savedMessage.getReceiverId(),

        conversationId:
          savedMessage.getConversationId(),

        content:
          savedMessage.getContent(),

        createdAt:
          savedMessage.getCreatedAt(),

        status:
          savedMessage.getStatus(),

      
        attachmentUrl:
          savedMessage.getAttachmentUrl(),

        
        attachmentType:
          savedMessage.getAttachmentType()
      }
    );

    return savedMessage;
  }
}
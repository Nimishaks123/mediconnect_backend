import { Message }
from "@domain/entities/Message";

export interface MessageResponseDTO {

  id: string;

  senderId: string;

  receiverId: string;

  conversationId: string;

  content: string;

  createdAt: Date;

  status: string;

  attachmentUrl?: string;

  attachmentType?: string;
}

export class ChatMapper {

  static toResponse(
    message: Message
  ): MessageResponseDTO {

    return {

      id:
        message.getId(),

      senderId:
        message.getSenderId(),

      receiverId:
        message.getReceiverId(),

      conversationId:
        message.getConversationId(),

      content:
        message.getContent(),

      createdAt:
        message.getCreatedAt(),

      status:
        message.getStatus(),

      attachmentUrl:
        message.getAttachmentUrl(),

      attachmentType:
        message.getAttachmentType()
    };
  }

  static toList(
    messages: Message[]
  ): MessageResponseDTO[] {

    return messages.map(
      (message) =>
        ChatMapper.toResponse(
          message
        )
    );
  }
}
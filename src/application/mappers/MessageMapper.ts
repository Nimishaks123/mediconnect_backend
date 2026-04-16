import { Message } from "@domain/entities/Message";
import { MessageStatus } from "@domain/enums/MessageStatus";
import { IMessageDocument } from "@infrastructure/persistence/models/MessageModel";

export class MessageMapper {
  static toDomain(doc: IMessageDocument): Message {
    return new Message(
      doc._id,
      doc.senderId,
      doc.receiverId,
      doc.conversationId,
      doc.content,
      doc.createdAt,
      doc.status as MessageStatus
    );
  }

  static toPersistence(domain: Message): any {
    return {
      _id: domain.getId(),
      senderId: domain.getSenderId(),
      receiverId: domain.getReceiverId(),
      conversationId: domain.getConversationId(),
      content: domain.getContent(),
      createdAt: domain.getCreatedAt(),
      status: domain.getStatus()
    };
  }
}

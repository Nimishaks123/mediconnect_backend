import { Message } from "@domain/entities/Message";

// export interface SendMessageDTO {
//   senderId: string;
//   receiverId: string;
//   conversationId: string;
//   content: string;
// }
export interface SendMessageDTO {

  senderId: string;

  receiverId: string;

  conversationId: string;

  content?: string;

  attachmentUrl?: string;

  attachmentType?: string;
}

export interface ISendMessageUseCase {
  execute(dto: SendMessageDTO): Promise<Message>;
}

import { Message } from "../entities/Message";

export interface IMessageRepository {
  save(message: Message): Promise<Message>;
  findByConversation(conversationId: string, page?: number, limit?: number): Promise<Message[]>;
  updateStatus(id: string, status: string): Promise<void>;
  markConversationAsRead(conversationId: string, userId: string): Promise<void>;
  findUnreadCount(userId: string): Promise<number>;
  getConversationList(userId: string): Promise<any[]>;
}

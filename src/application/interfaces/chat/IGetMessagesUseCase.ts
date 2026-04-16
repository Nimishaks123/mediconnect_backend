import { Message } from "@domain/entities/Message";

export interface GetMessagesDTO {
  conversationId: string;
  page: number;
  limit: number;
}

export interface IGetMessagesUseCase {
  execute(dto: GetMessagesDTO): Promise<Message[]>;
}

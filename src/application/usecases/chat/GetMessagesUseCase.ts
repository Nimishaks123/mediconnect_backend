import { Message } from "@domain/entities/Message";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";

export interface GetMessagesDTO {
  conversationId: string;
  page?: number;
  limit?: number;
}

export class GetMessagesUseCase {
  constructor(private readonly messageRepo: IMessageRepository) {}

  async execute(dto: GetMessagesDTO): Promise<Message[]> {
    return await this.messageRepo.findByConversation(
      dto.conversationId,
      dto.page,
      dto.limit
    );
  }
}

import { IMessageRepository } from "@domain/interfaces/IMessageRepository";

export class MarkConversationAsReadUseCase {
  constructor(private readonly messageRepo: IMessageRepository) {}

  async execute({ conversationId, userId }: { conversationId: string; userId: string }): Promise<void> {
    await this.messageRepo.markConversationAsRead(conversationId, userId);
  }
}

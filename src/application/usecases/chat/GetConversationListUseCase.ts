import { IMessageRepository } from "@domain/interfaces/IMessageRepository";

export class GetConversationListUseCase {
  constructor(private readonly messageRepo: IMessageRepository) {}

  async execute(userId: string): Promise<any[]> {
    return await this.messageRepo.getConversationList(userId);
  }
}

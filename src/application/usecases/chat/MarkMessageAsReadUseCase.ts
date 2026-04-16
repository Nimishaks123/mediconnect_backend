import { IMessageRepository } from "@domain/interfaces/IMessageRepository";

export class MarkMessageAsReadUseCase {
  constructor(private readonly messageRepo: IMessageRepository) {}

  async execute(id: string): Promise<void> {
    await this.messageRepo.markAsRead(id);
  }
}

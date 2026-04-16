export interface IMarkConversationAsReadUseCase {
  execute(dto: { conversationId: string; userId: string }): Promise<void>;
}

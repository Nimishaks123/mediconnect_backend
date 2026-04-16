export interface IGetConversationListUseCase {
  execute(userId: string): Promise<any[]>;
}

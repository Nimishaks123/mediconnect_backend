export interface IMarkNotificationAsReadUseCase {
  execute(notificationId: string): Promise<void>;
}

export interface INotificationService {
  notifyUser(userId: string, event: string, data: any): void;
  notifyAll(event: string, data: any): void;
}

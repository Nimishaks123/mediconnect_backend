import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByUser(userId: string, page: number, limit: number): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }>;
}

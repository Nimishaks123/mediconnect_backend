import { Notification } from "@domain/entities/Notification";

export interface IGetUserNotificationsUseCase {
  execute(userId: string, page: number, limit: number): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    }
  }>;
}

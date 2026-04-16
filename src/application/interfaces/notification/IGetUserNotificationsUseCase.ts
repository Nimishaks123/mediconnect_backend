import { Notification } from "@domain/entities/Notification";
import { GetUserNotificationsDTO } from "../../dtos/notification/GetUserNotificationsDTO";

export interface IGetUserNotificationsUseCase {
  execute(dto: GetUserNotificationsDTO): Promise<{
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

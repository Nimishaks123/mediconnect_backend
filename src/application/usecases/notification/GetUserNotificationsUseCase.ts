import { IGetUserNotificationsUseCase } from "../../interfaces/notification/IGetUserNotificationsUseCase";
import { INotificationRepository } from "../../../domain/interfaces/INotificationRepository";

export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(userId: string, page: number, limit: number) {
    const { notifications, total, unreadCount } = await this.notificationRepo.findByUser(userId, page, limit);

    return {
      notifications,
      total,
      unreadCount,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

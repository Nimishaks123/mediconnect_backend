import { IMarkNotificationAsReadUseCase } from "../../interfaces/notification/IMarkNotificationAsReadUseCase";
import { INotificationRepository } from "../../../domain/interfaces/INotificationRepository";
import { AppError } from "@common/AppError";

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(notificationId: string): Promise<void> {
    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    notification.markAsRead();
    await this.notificationRepo.save(notification);
  }
}

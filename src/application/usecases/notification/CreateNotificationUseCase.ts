import { ICreateNotificationUseCase, CreateNotificationDTO } from "../../interfaces/notification/ICreateNotificationUseCase";
import { INotificationRepository } from "../../../domain/interfaces/INotificationRepository";
import { Notification } from "../../../domain/entities/Notification";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { v4 as uuid } from "uuid";

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(
    private readonly notificationRepo: INotificationRepository,
    private readonly socketService: INotificationService
  ) {}

  async execute(dto: CreateNotificationDTO): Promise<Notification> {
    const notification = Notification.create(
      uuid(),
      dto.userId,
      dto.title,
      dto.message,
      dto.type
    );

    const savedNotification = await this.notificationRepo.save(notification);

    // Emit real-time notification
    console.log(`[Notification] Emitting real-time notification to user: ${dto.userId}`);
    this.socketService.notifyUser(dto.userId, "notification", {
      id: savedNotification.getId(),
      title: savedNotification.getTitle(),
      message: savedNotification.getMessage(),
      type: savedNotification.getType(),
      isRead: savedNotification.getIsRead(),
      createdAt: savedNotification.getCreatedAt()
    });

    return savedNotification;
  }
}

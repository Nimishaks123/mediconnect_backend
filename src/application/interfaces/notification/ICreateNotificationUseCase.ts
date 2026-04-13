import { Notification } from "@domain/entities/Notification";
import { NotificationType } from "@domain/enums/NotificationType";

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}

export interface ICreateNotificationUseCase {
  execute(dto: CreateNotificationDTO): Promise<Notification>;
}

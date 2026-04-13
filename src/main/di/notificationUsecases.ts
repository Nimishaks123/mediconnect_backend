import { CreateNotificationUseCase } from "@application/usecases/notification/CreateNotificationUseCase";
import { GetUserNotificationsUseCase } from "@application/usecases/notification/GetUserNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "@application/usecases/notification/MarkNotificationAsReadUseCase";
import { notificationRepository } from "./repositories";
import { notificationService } from "./services";

export const createNotificationUseCase = new CreateNotificationUseCase(
  notificationRepository,
  notificationService
);

export const getUserNotificationsUseCase = new GetUserNotificationsUseCase(
  notificationRepository
);

export const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(
  notificationRepository
);

import { Notification } from "../../domain/entities/Notification";
import { INotificationDocument } from "./models/NotificationModel";

export class NotificationMapper {
  public static toDomain(doc: INotificationDocument): Notification {
    return new Notification(
      doc._id.toString(),
      doc.userId.toString(),
      doc.title,
      doc.message,
      doc.type,
      doc.isRead,
      doc.createdAt
    );
  }

  public static toPersistence(domain: Notification): any {
    return {
      _id: domain.getId(),
      userId: domain.getUserId(),
      title: domain.getTitle(),
      message: domain.getMessage(),
      type: domain.getType(),
      isRead: domain.getIsRead(),
      createdAt: domain.getCreatedAt()
    };
  }
}

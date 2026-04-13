import { INotificationRepository } from "../../domain/interfaces/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import { NotificationModel } from "./models/NotificationModel";
import { NotificationMapper } from "../../application/mappers/NotificationMapper";

export class NotificationRepository implements INotificationRepository {
  async save(notification: Notification): Promise<Notification> {
    const data = NotificationMapper.toPersistence(notification);
    const doc = await NotificationModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { upsert: true, new: true }
    );
    return NotificationMapper.toDomain(doc!);
  }

  async findById(id: string): Promise<Notification | null> {
    const doc = await NotificationModel.findById(id);
    return doc ? NotificationMapper.toDomain(doc) : null;
  }

  async findByUser(userId: string, page: number, limit: number): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    const skip = (page - 1) * limit;

    const [docs, total, unreadCount] = await Promise.all([
      NotificationModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NotificationModel.countDocuments({ userId }),
      NotificationModel.countDocuments({ userId, isRead: false })
    ]);

    return {
      notifications: docs.map(doc => NotificationMapper.toDomain(doc)),
      total,
      unreadCount
    };
  }
}

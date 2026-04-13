import mongoose, { Schema, Document } from "mongoose";
import { NotificationType } from "../../../domain/enums/NotificationType";

export interface INotificationDocument extends Document {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>({
  _id: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(NotificationType), 
    required: true 
  },
  isRead: { type: Boolean, default: false, index: true },
}, { 
  _id: false,
  timestamps: { createdAt: true, updatedAt: false } 
});

export const NotificationModel = mongoose.model<INotificationDocument>("Notification", NotificationSchema);

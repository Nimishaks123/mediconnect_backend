import { Types } from "mongoose";
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { Message } from "@domain/entities/Message";
import { MessageModel } from "./models/MessageModel";
import { MessageMapper } from "@application/mappers/MessageMapper";

import { MessageStatus } from "@domain/enums/MessageStatus";

export class MessageRepository implements IMessageRepository {
  async save(message: Message): Promise<Message> {
    const data = MessageMapper.toPersistence(message);
    const doc = await MessageModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { upsert: true, new: true }
    );
    return MessageMapper.toDomain(doc!);
  }

  async findByConversation(conversationId: string, page: number = 1, limit: number = 50): Promise<Message[]> {
    const skip = (page - 1) * limit;
    const docs = await MessageModel.find({ conversationId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

    return docs.map(doc => MessageMapper.toDomain(doc));
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await MessageModel.findByIdAndUpdate(id, { status });
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    await MessageModel.updateMany(
      { conversationId, receiverId: userId, status: { $ne: MessageStatus.SEEN } },
      { $set: { status: MessageStatus.SEEN } }
    );
  }

  async findUnreadCount(userId: string): Promise<number> {
    return await MessageModel.countDocuments({ receiverId: userId, status: { $ne: MessageStatus.SEEN } });
  }

  async getConversationList(userId: string): Promise<any[]> {
    return await MessageModel.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ["$receiverId", userId] },
                  { $ne: ["$status", MessageStatus.SEEN] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      // Join with Appointments to get peer info
      {
        $lookup: {
          from: "appointments",
          localField: "_id",
          foreignField: "appointmentId",
          as: "appointment"
        }
      },
      { $unwind: { path: "$appointment", preserveNullAndEmptyArrays: true } },
      
      {
        $lookup: {
          from: "doctors",
          localField: "appointment.doctorId",
          foreignField: "_id",
          as: "doctorDoc"
        }
      },
      { $unwind: { path: "$doctorDoc", preserveNullAndEmptyArrays: true } },
      
      {
        $addFields: {
          peerId: {
            $cond: {
              if: { $eq: ["$doctorDoc.userId", new Types.ObjectId(userId)] },
              then: "$appointment.patientId",
              else: "$doctorDoc.userId"
            }
          }
        }
      },
      
      {
        $lookup: {
          from: "users",
          localField: "peerId",
          foreignField: "_id",
          as: "peer"
        }
      },
      { $unwind: { path: "$peer", preserveNullAndEmptyArrays: true } },
      
      {
        $project: {
          conversationId: "$_id",
          lastMessage: 1,
          unreadCount: 1,
          peer: {
            id: { $toString: "$peer._id" },
            name: { $ifNull: ["$peer.name", "Unknown"] },
            photo: { $ifNull: ["$peer.profilePhoto", null] }
          },
          appointment: {
            id: "$appointment.appointmentId",
            date: "$appointment.date",
            startTime: "$appointment.startTime",
            endTime: "$appointment.endTime",
            status: "$appointment.status"
          }
        }
      },
      { $sort: { "lastMessage.createdAt": -1 } }
    ]);
  }
}

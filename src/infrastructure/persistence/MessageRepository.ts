import { Types } from "mongoose";

import { IMessageRepository }
from "@domain/interfaces/IMessageRepository";

import { Message }
from "@domain/entities/Message";

import { MessageModel }
from "./models/MessageModel";

import { MessageMapper }
from "@application/mappers/MessageMapper";

import { MessageStatus }
from "@domain/enums/MessageStatus";

export class MessageRepository
implements IMessageRepository {

  async save(
    message: Message
  ): Promise<Message> {

    const data =
      MessageMapper.toPersistence(
        message
      );

    const doc =
      await MessageModel.findByIdAndUpdate(
        data._id,
        { $set: data },
        {
          upsert: true,
          new: true
        }
      );

    return MessageMapper.toDomain(
      doc!
    );
  }

  async findByConversation(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Message[]> {
      console.log(
    "FETCHING CONVERSATION:",
    conversationId
  );

    const skip =
      (page - 1) * limit;

    const docs =
      await MessageModel.find({
        conversationId
      })
        .sort({
          createdAt: 1
        })
        .skip(skip)
        .limit(limit);
          console.log(
    "FOUND MESSAGES:",
    docs.length
  );

    return docs.map((doc) =>
      MessageMapper.toDomain(doc)
    );
  }

  async updateStatus(
    id: string,
    status: string
  ): Promise<void> {

    await MessageModel.findByIdAndUpdate(
      id,
      { status }
    );
  }

  async markConversationAsRead(
    conversationId: string,
    userId: string
  ): Promise<void> {

    await MessageModel.updateMany(
      {
        conversationId,
        receiverId: userId,
        status: {
          $ne: MessageStatus.SEEN
        }
      },
      {
        $set: {
          status: MessageStatus.SEEN
        }
      }
    );
  }

  async markAsRead(
    messageId: string
  ): Promise<void> {

    await MessageModel.findByIdAndUpdate(
      messageId,
      {
        status: MessageStatus.SEEN
      }
    );
  }

  async findUnreadCount(
    userId: string
  ): Promise<number> {

    return await MessageModel.countDocuments({
      receiverId: userId,
      status: {
        $ne: MessageStatus.SEEN
      }
    });
  }

  async getConversationList(
    userId: string
  ): Promise<any[]> {

    return await MessageModel.aggregate([

      // ONLY USER MESSAGES
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },

      // LATEST FIRST
      {
        $sort: {
          createdAt: -1
        }
      },

      // GROUP BY PARTICIPANTS
      {
        $group: {

          _id: {

            participants: {

              $cond: {

                if: {
                  $gt: [
                    "$senderId",
                    "$receiverId"
                  ]
                },

                then: [
                  "$receiverId",
                  "$senderId"
                ],

                else: [
                  "$senderId",
                  "$receiverId"
                ]
              }
            }
          },

          lastMessage: {
            $first: "$$ROOT"
          },

          unreadCount: {

            $sum: {

              $cond: [

                {
                  $and: [

                    {
                      $eq: [
                        "$receiverId",
                        userId
                      ]
                    },

                    {
                      $ne: [
                        "$status",
                        MessageStatus.SEEN
                      ]
                    }
                  ]
                },

                1,

                0
              ]
            }
          }
        }
      },

      // APPOINTMENT LOOKUP
      {
        $lookup: {

          from: "appointments",

          localField:
            "lastMessage.conversationId",

          foreignField:
            "appointmentId",

          as: "appointment"
        }
      },

      {
        $unwind: {
          path: "$appointment",
          preserveNullAndEmptyArrays: true
        }
      },

      // DOCTOR LOOKUP
      {
        $lookup: {

          from: "doctors",

          localField:
            "appointment.doctorId",

          foreignField: "_id",

          as: "doctorDoc"
        }
      },

      {
        $unwind: {
          path: "$doctorDoc",
          preserveNullAndEmptyArrays: true
        }
      },

      // PEER USER
      {
        $addFields: {

          peerId: {

            $cond: {

              if: {
                $eq: [
                  "$doctorDoc.userId",
                  new Types.ObjectId(
                    userId
                  )
                ]
              },

              then:
                "$appointment.patientId",

              else:
                "$doctorDoc.userId"
            }
          }
        }
      },

      // USER LOOKUP
      {
        $lookup: {

          from: "users",

          localField: "peerId",

          foreignField: "_id",

          as: "peer"
        }
      },

      {
        $unwind: {
          path: "$peer",
          preserveNullAndEmptyArrays: true
        }
      },

      // FINAL RESPONSE
      {
        $project: {

          conversationId:
            "$lastMessage.conversationId",

          lastMessage: 1,

          unreadCount: 1,

          peer: {

            id: {
              $toString: "$peer._id"
            },

            name: {
              $ifNull: [
                "$peer.name",
                "Unknown"
              ]
            },

            photo: {
              $ifNull: [
                "$peer.profilePhoto",
                null
              ]
            }
          },

          appointment: {

            id:
              "$appointment.appointmentId",

            date:
              "$appointment.date",

            startTime:
              "$appointment.startTime",

            endTime:
              "$appointment.endTime",

            status:
              "$appointment.status"
          }
        }
      },

      // SORT BY LAST MESSAGE
      {
        $sort: {
          "lastMessage.createdAt": -1
        }
      }
    ]);
  }
  async findByConversationIds(conversationIds: string[]): Promise<Message[]> {
    const docs=await MessageModel.find({
      conversationId:{
        $in:conversationIds
      }

    }).sort({
      createdAt:1
    });
    return docs.map((doc)=>MessageMapper.toDomain(doc))
    
  }
}
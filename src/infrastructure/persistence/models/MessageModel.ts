import mongoose, {
  Schema,
  Document
} from "mongoose";

export interface IMessageDocument
extends Document {

  _id: string;

  senderId: string;

  receiverId: string;

  conversationId: string;

  content: string;

  status: string;

  createdAt: Date;

  attachmentUrl?: string;

  attachmentType?: string;
}

const MessageSchema =
  new Schema<IMessageDocument>({

    _id: {
      type: String,
      required: true
    },

    senderId: {
      type: String,
      required: true,
      index: true
    },

    receiverId: {
      type: String,
      required: true,
      index: true
    },

    conversationId: {
      type: String,
      required: true,
      index: true
    },

    content: {
      type: String,
      required: false,
      default: ""
    },

    attachmentUrl: {
      type: String,
      required: false
    },

    attachmentType: {
      type: String,
      required: false
    },

    status: {
      type: String,

      enum: [
        "sent",
        "delivered",
        "seen"
      ],

      default: "sent",

      index: true
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }

  }, {

    _id: false,

    timestamps: false
  });

// FAST FETCHING
MessageSchema.index({
  conversationId: 1,
  createdAt: 1
});

export const MessageModel =
  mongoose.model<IMessageDocument>(
    "Message",
    MessageSchema
  );
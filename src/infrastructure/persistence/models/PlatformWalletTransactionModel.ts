import mongoose, {
  Schema,
  Document,
} from "mongoose";

import {
  PlatformTransactionType,
} from "@domain/enums/PlatformTransactionType";

import {
  PlatformTransactionSource,
} from "@domain/enums/PlatformTransactionSource";

export interface IPlatformWalletTransactionDocument
  extends Document {

  transactionRef: string;

  walletId: mongoose.Types.ObjectId;

  appointmentId: string;

  amount: number;

  description: string;

  type: PlatformTransactionType;

  source: PlatformTransactionSource;

  createdAt: Date;
}

const PlatformWalletTransactionSchema =
  new Schema(
    {
      transactionRef: {
        type: String,
        required: true,
        unique: true,
      },

      walletId: {
        type: Schema.Types.ObjectId,
        ref: "PlatformWallet",
        required: true,
      },

      appointmentId: {
        type: String,
        required: true,
      },

      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      description: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: Object.values(
          PlatformTransactionType
        ),
        required: true,
      },

      source: {
        type: String,
        enum: Object.values(
          PlatformTransactionSource
        ),
        required: true,
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
    }
  );

export const PlatformWalletTransactionModel =
  mongoose.model<IPlatformWalletTransactionDocument>(
    "PlatformWalletTransaction",
    PlatformWalletTransactionSchema
  );
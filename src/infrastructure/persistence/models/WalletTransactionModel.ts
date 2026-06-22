import mongoose, {
  Schema,
  Document,
} from "mongoose";

import { TransactionType }
from "@domain/enums/TransactionType";

import { TransactionSource }
from "@domain/enums/TransactionSource";

import { TransactionStatus }
from "@domain/enums/TransactionStatus";

export interface IWalletTransactionDocument
  extends Document {

  transactionRef: string;

  walletId:
    mongoose.Types.ObjectId;

  amount: number;
  description: string;

  type: TransactionType;

  source: TransactionSource;

  status: TransactionStatus;

  stripeSessionId:
    string | null;

  createdAt: Date;

  updatedAt: Date;
}

const WalletTransactionSchema =
  new Schema(
    {
      transactionRef: {
        type: String,

        required: true,

        unique: true,

        index: true,
      },

      walletId: {
        type:
          Schema.Types.ObjectId,

        ref: "Wallet",

        required: true,

        index: true,
      },

      amount: {
        type: Number,

        required: true,

        min: 0,
      },
      description: {
  type: String,

  required: true,

  trim: true,
},

      type: {
        type: String,

        enum:
          Object.values(
            TransactionType
          ),

        required: true,
      },

      source: {
        type: String,

        enum:
          Object.values(
            TransactionSource
          ),

        required: true,
      },

      status: {
        type: String,

        enum:
          Object.values(
            TransactionStatus
          ),

        required: true,

        default:
          TransactionStatus.PENDING,
      },

      stripeSessionId: {
        type: String,

        default: null,

        sparse: true,
      },
    },
    {
      timestamps: true,
    }
  );

WalletTransactionSchema.index({
  transactionRef: 1,
});

WalletTransactionSchema.index({
  walletId: 1,
  createdAt: -1,
});

WalletTransactionSchema.index({
  stripeSessionId: 1,
});

export const WalletTransactionModel =
  mongoose.model<IWalletTransactionDocument>(
    "WalletTransaction",
    WalletTransactionSchema
  );
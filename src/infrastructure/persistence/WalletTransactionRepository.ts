import { WalletTransaction }
from "@domain/entities/WalletTransaction";

import { IWalletTransactionRepository }
from "@domain/interfaces/IWalletTransactionRepository";

import {
  WalletTransactionModel,
  IWalletTransactionDocument,
} from "./models/WalletTransactionModel";

import {
  TransactionType,
} from "@domain/enums/TransactionType";

import {
  TransactionSource,
} from "@domain/enums/TransactionSource";

import {
  TransactionStatus,
} from "@domain/enums/TransactionStatus";

import mongoose from "mongoose";

export class WalletTransactionRepository
  implements IWalletTransactionRepository {

  async create(
    transaction: WalletTransaction
  ): Promise<WalletTransaction> {

    const doc =
      await WalletTransactionModel.create({
        transactionRef:
          transaction.getTransactionRef(),

        walletId:
          new mongoose.Types.ObjectId(
            transaction.getWalletId()
          ),

        amount:
          transaction.getAmount(),
          description:
  transaction.getDescription(),

        type:
          transaction.getType(),

        source:
          transaction.getSource(),

        status:
          transaction.getStatus(),

        stripeSessionId:
          transaction.getStripeSessionId(),
      });

    return this.mapToDomain(doc);
  }

  async save(
    transaction: WalletTransaction
  ): Promise<void> {

    await WalletTransactionModel.findByIdAndUpdate(
      transaction.getId(),
      {
        status:
          transaction.getStatus(),
      }
    );
  }

  async findByWalletId(
    walletId: string,
    page: number,
    limit: number
  ): Promise<{
    transactions: WalletTransaction[];
    total: number;
  }> {

    const skip =
      (page - 1) * limit;

    const [docs, total] =
      await Promise.all([
        WalletTransactionModel
          .find({
            walletId:
              new mongoose.Types.ObjectId(
                walletId
              ),
          })
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        WalletTransactionModel
          .countDocuments({
            walletId:
              new mongoose.Types.ObjectId(
                walletId
              ),
          }),
      ]);

    return {
      transactions:
        docs.map((doc) =>
          this.mapToDomain(doc)
        ),

      total,
    };
  }

  async findByTransactionRef(
    transactionRef: string
  ): Promise<WalletTransaction | null> {

    const doc =
      await WalletTransactionModel.findOne({
        transactionRef,
      });

    return doc
      ? this.mapToDomain(doc)
      : null;
  }
  async findById(
  id: string
): Promise<WalletTransaction | null> {

  const doc =
    await WalletTransactionModel.findById(
      id
    );

  return doc
    ? this.mapToDomain(doc)
    : null;
}

  async findByStripeSessionId(
    stripeSessionId: string
  ): Promise<WalletTransaction | null> {

    const doc =
      await WalletTransactionModel.findOne({
        stripeSessionId,
      });

    return doc
      ? this.mapToDomain(doc)
      : null;
  }

  private mapToDomain(
    doc: IWalletTransactionDocument
  ): WalletTransaction {

    return WalletTransaction.rehydrate({
      id:
        doc._id.toString(),

      transactionRef:
        doc.transactionRef,

      walletId:
        doc.walletId.toString(),

      amount:
        doc.amount,
        description:
  doc.description,

      type:
        doc.type as TransactionType,

      source:
        doc.source as TransactionSource,

      status:
        doc.status as TransactionStatus,

      stripeSessionId:
        doc.stripeSessionId,

      createdAt:
        doc.createdAt,
    });
  }
}
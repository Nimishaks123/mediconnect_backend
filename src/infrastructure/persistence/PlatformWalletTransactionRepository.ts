import mongoose from "mongoose";

import { PlatformWalletTransaction } from "@domain/entities/PlatformWalletTransaction";

import { IPlatformWalletTransactionRepository } from "@domain/interfaces/IPlatformWalletTransactionRepository";

import {
  PlatformWalletTransactionModel,
  IPlatformWalletTransactionDocument,
} from "./models/PlatformWalletTransactionModel";

import {
  PlatformTransactionType,
} from "@domain/enums/PlatformTransactionType";

import {
  PlatformTransactionSource,
} from "@domain/enums/PlatformTransactionSource";

export class PlatformWalletTransactionRepository
  implements IPlatformWalletTransactionRepository {

  async create(
    transaction: PlatformWalletTransaction
  ): Promise<PlatformWalletTransaction> {

    const doc =
      await PlatformWalletTransactionModel.create({

        transactionRef:
          transaction.getTransactionRef(),

        walletId:
          new mongoose.Types.ObjectId(
            transaction.getWalletId()
          ),

        appointmentId:
            transaction.getAppointmentId()
          ,

        amount:
          transaction.getAmount(),

        description:
          transaction.getDescription(),

        type:
          transaction.getType(),

        source:
          transaction.getSource(),
      });

    return this.mapToDomain(doc);
  }

  async findByWalletId(
    walletId: string,
    page: number,
    limit: number
  ): Promise<{
    transactions: PlatformWalletTransaction[];
    total: number;
  }> {

    const skip =
      (page - 1) * limit;

    const [docs, total] =
      await Promise.all([

        PlatformWalletTransactionModel
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

        PlatformWalletTransactionModel
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
  ): Promise<PlatformWalletTransaction | null> {

    const doc =
      await PlatformWalletTransactionModel.findOne({
        transactionRef,
      });

    return doc
      ? this.mapToDomain(doc)
      : null;
  }

  private mapToDomain(
    doc: IPlatformWalletTransactionDocument
  ): PlatformWalletTransaction {

    return PlatformWalletTransaction.rehydrate({

      id:
        doc._id.toString(),

      transactionRef:
        doc.transactionRef,

      walletId:
        doc.walletId.toString(),

      appointmentId:
        doc.appointmentId,

      amount:
        doc.amount,

      description:
        doc.description,

      type:
        doc.type as PlatformTransactionType,

      source:
        doc.source as PlatformTransactionSource,

      createdAt:
        doc.createdAt,
    });
  }
}

import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { Wallet } from "@domain/entities/Wallet";
import {
  WalletModel,
  IWalletDocument,
} from "./models/WalletModel";
import mongoose from "mongoose";

export class WalletRepositoryImpl
  implements IWalletRepository {
    async findById(
  walletId: string
): Promise<Wallet | null> {

  const doc =
    await WalletModel.findById(
      walletId
    );

  if (!doc) {
    return null;
  }

  return this.mapToDomain(doc);
}

  async findByUserId(
    userId: string
  ): Promise<Wallet | null> {

    const doc =
      await WalletModel.findOne({
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),
      });

    if (!doc) return null;

    return this.mapToDomain(doc);
  }
  

  async create(
    wallet: Wallet
  ): Promise<Wallet> {

    const doc =
      new WalletModel({
        userId:
          new mongoose.Types.ObjectId(
            wallet.getUserId()
          ),

        balance:
          wallet.getBalance(),
      });

    await doc.save();

    return this.mapToDomain(doc);
  }

  async save(
    wallet: Wallet
  ): Promise<void> {

    await WalletModel.findOneAndUpdate(
      {
        userId:
          new mongoose.Types.ObjectId(
            wallet.getUserId()
          ),
      },
      {
        $set: {
          balance:
            wallet.getBalance(),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  private mapToDomain(
    doc: IWalletDocument
  ): Wallet {

    return new Wallet(
      doc._id.toString(),

      doc.userId.toString(),

      doc.balance
    );
  }
}
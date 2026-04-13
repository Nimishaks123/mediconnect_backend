import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { Wallet } from "@domain/entities/Wallet";
import { WalletModel, IWalletDocument } from "../models/WalletModel";
import mongoose from "mongoose";

export class WalletRepositoryImpl implements IWalletRepository {
  async findByUserId(userId: string): Promise<Wallet | null> {
    const doc = await WalletModel.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!doc) return null;
    return this.mapToDomain(doc as unknown as IWalletDocument);
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const doc = new WalletModel({
      userId: new mongoose.Types.ObjectId(wallet.getUserId()),
      balance: wallet.getBalance(),
      transactions: wallet.getTransactions()
    });
    await doc.save();
    return this.mapToDomain(doc);
  }

  async save(wallet: Wallet): Promise<void> {
    await WalletModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(wallet.getUserId()) },
      {
        $set: {
          balance: wallet.getBalance(),
          transactions: wallet.getTransactions(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  private mapToDomain(doc: IWalletDocument): Wallet {
    return new Wallet(
      doc._id.toString(),
      doc.userId.toString(),
      doc.balance,
      doc.transactions.map((t) => ({
        type: t.type,
        amount: t.amount,
        description: t.description,
        createdAt: t.createdAt,
      }))
    );
  }
}

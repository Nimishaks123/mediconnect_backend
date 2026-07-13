import { IPlatformWalletRepository } from "@domain/interfaces/IPlatformWalletRepository";
import { PlatformWallet } from "@domain/entities/PlatformWallet";

import {
  PlatformWalletModel,
  IPlatformWalletDocument,
} from "./models/PlatformWalletModel";

export class PlatformWalletRepository
  implements IPlatformWalletRepository {

  async find(): Promise<PlatformWallet | null> {

    const doc =
      await PlatformWalletModel.findOne();

    if (!doc) {
      return null;
    }

    return this.mapToDomain(doc);
  }

  async create(
    wallet: PlatformWallet
  ): Promise<PlatformWallet> {

    const doc =
      await PlatformWalletModel.create({
        balance:
          wallet.getBalance(),
      });

    return this.mapToDomain(doc);
  }

  async save(
    wallet: PlatformWallet
  ): Promise<void> {

    await PlatformWalletModel.findByIdAndUpdate(
      wallet.getId(),
      {
        $set: {
          balance:
            wallet.getBalance(),
        },
      }
    );
  }

  private mapToDomain(
  doc: IPlatformWalletDocument
): PlatformWallet {

  return PlatformWallet.rehydrate(
    doc._id.toString(),
    doc.balance,
    doc.createdAt,
    doc.updatedAt
  );
}
}
import { IPlatformWalletRepository }
from "@domain/interfaces/IPlatformWalletRepository";

import { PlatformWallet }
from "@domain/entities/PlatformWallet";

import { PlatformWalletDTO } from "./PlatformWalletDTO";

export class GetPlatformWalletUseCase {

  constructor(
    private readonly walletRepo:
      IPlatformWalletRepository
  ) {}

  async execute(): Promise<PlatformWalletDTO> {

    let wallet =
      await this.walletRepo.find();

    if (!wallet) {

      wallet =
        await this.walletRepo.create(
          PlatformWallet.create()
        );
    }

    return {

      walletId:
        wallet.getId(),

      balance:
        wallet.getBalance(),
    };
  }
}
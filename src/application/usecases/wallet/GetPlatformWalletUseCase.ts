import { PlatformWallet }
from "@domain/entities/PlatformWallet";

import { IPlatformWalletRepository }
from "@domain/interfaces/IPlatformWalletRepository";

import {
  IGetPlatformWalletUseCase,
} from "@application/interfaces/platformWallet/IGetPlatformWalletUseCase";
import { PlatformWalletDTO } from "@application/dtos/wallet/PlatformWalletDTO";

export class GetPlatformWalletUseCase
  implements IGetPlatformWalletUseCase {

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

      createdAt:
        wallet.getCreatedAt(),

      updatedAt:
        wallet.getUpdatedAt(),
    };
  }
}
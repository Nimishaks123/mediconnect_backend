import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { Wallet } from "@domain/entities/Wallet";

export class GetUserWalletUseCase {
  constructor(private readonly walletRepo: IWalletRepository) {}

  async execute(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepo.findByUserId(userId);

    if (wallet) {
      return wallet;
    }

    const newWallet = Wallet.create(userId);
    await this.walletRepo.create(newWallet);

    return newWallet;
  }
}

import { IWalletRepository } from "../../domain/interfaces/IWalletRepository";
import { Wallet } from "../../domain/entities/Wallet";
import logger from "../../common/logger";

export class WalletService {
  constructor(private readonly walletRepo: IWalletRepository) {}

  async creditAmount(userId: string, amount: number, description: string): Promise<void> {
    try {
      let wallet = await this.walletRepo.findByUserId(userId);
      
      if (!wallet) {
        logger.info(`Wallet not found for user ${userId}, creating new one.`);
        wallet = Wallet.create(userId);
        await this.walletRepo.save(wallet);
      }

      wallet.credit(amount, description);
      await this.walletRepo.save(wallet);
      
      logger.info(`Successfully credited ₹${amount} to wallet of user ${userId}: ${description}`);
    } catch (error) {
      logger.error(`Failed to credit wallet for user ${userId}:`, error);
      throw error;
    }
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.walletRepo.findByUserId(userId);
    return wallet ? wallet.getBalance() : 0;
  }
}

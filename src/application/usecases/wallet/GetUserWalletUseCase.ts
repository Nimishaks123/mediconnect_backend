import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { Wallet } from "@domain/entities/Wallet";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IGetUserWalletUseCase } from "@application/interfaces/wallet/IGetUserWalletUseCase";
import { GetUserWalletDTO } from "@application/dtos/wallet/GetUserWalletDTO";

export class GetUserWalletUseCase implements IGetUserWalletUseCase {
  constructor(private readonly walletRepo: IWalletRepository) {}

  async execute(dto: GetUserWalletDTO): Promise<Wallet> {
    const { userId } = dto;
    
    try {
      console.log("[GetUserWallet] User ID:", userId);
      
      const wallet = await this.walletRepo.findByUserId(userId);

      if (wallet) {
        console.log("[GetUserWallet] Existing wallet found:", wallet.getId());
        return wallet;
      }

      console.log("[GetUserWallet] No wallet found, creating new wallet for user:", userId);
      const newWallet = Wallet.create(userId);
      await this.walletRepo.create(newWallet);

      return newWallet;
    } catch (error) {
      console.error("[GetUserWallet] Error:", error);
      throw new AppError("Failed to fetch wallet data", StatusCode.INTERNAL_SERVER_ERROR);
    }
  }
}

import {CreditPlatformWalletDTO } from "@application/dtos/wallet/CreditPlatformWalletDTO"
export interface ICreditPlatformWalletUseCase {
  execute(
    dto: CreditPlatformWalletDTO
  ): Promise<void>;
}
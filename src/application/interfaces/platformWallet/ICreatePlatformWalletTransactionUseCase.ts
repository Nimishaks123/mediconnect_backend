import { PlatformWalletTransaction } from "@domain/entities/PlatformWalletTransaction";
import { PlatformTransactionType } from "@domain/enums/PlatformTransactionType";
import { PlatformTransactionSource } from "@domain/enums/PlatformTransactionSource";
import {CreatePlatformWalletTransactionDTO} from "@application/dtos/wallet/CreatePlatformWalletTransactionDTO"

export interface ICreatePlatformWalletTransactionUseCase {
  execute(
    dto: CreatePlatformWalletTransactionDTO
  ): Promise<PlatformWalletTransaction>;
}
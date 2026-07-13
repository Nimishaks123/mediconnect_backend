import { PlatformWalletTransaction } from "@domain/entities/PlatformWalletTransaction";

export interface IPlatformWalletTransactionRepository {
  create(
    transaction: PlatformWalletTransaction
  ): Promise<PlatformWalletTransaction>;

  findByWalletId(
    walletId: string,
    page: number,
    limit: number
  ): Promise<{
    transactions: PlatformWalletTransaction[];
    total: number;
  }>;

  findByTransactionRef(
    transactionRef: string
  ): Promise<PlatformWalletTransaction | null>;
}
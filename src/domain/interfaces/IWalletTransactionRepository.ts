import { WalletTransaction }
from "../entities/WalletTransaction";

export interface IWalletTransactionRepository {

  create(
    transaction:
      WalletTransaction
  ): Promise<WalletTransaction>;

  save(
    transaction:
      WalletTransaction
  ): Promise<void>;

  findByWalletId(
    walletId: string,

    page: number,

    limit: number
  ): Promise<{
    transactions:
      WalletTransaction[];

    total: number;
  }>;

  findByTransactionRef(
    transactionRef: string
  ): Promise<
    WalletTransaction | null
  >;

  findByStripeSessionId(
    stripeSessionId: string
  ): Promise<
    WalletTransaction | null
  >;
  findById(
  id: string
): Promise<WalletTransaction | null>;
}
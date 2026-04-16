import { Wallet } from "@domain/entities/Wallet";
import { WalletTransaction } from "@domain/entities/Wallet";

export class WalletResponseMapper {
  static toResponse(wallet: Wallet) {
    // Sorting transactions in descending order of creation
    const sortedTransactions = [...wallet.getTransactions()].sort(
      (a: WalletTransaction, b: WalletTransaction) => 
        b.createdAt.getTime() - a.createdAt.getTime()
    );

    return {
      balance: wallet.getBalance(),
      transactions: sortedTransactions,
    };
  }
}

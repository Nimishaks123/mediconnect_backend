
import { AppError }
from "@common/AppError";

import { StatusCode }
from "@common/enums";

import { IWalletRepository }
from "@domain/interfaces/IWalletRepository";

import { IWalletTransactionRepository }
from "@domain/interfaces/IWalletTransactionRepository";

export class ProcessWalletTopupWebhookUseCase {

  constructor(
    private readonly walletRepo:
      IWalletRepository,

    private readonly transactionRepo:
      IWalletTransactionRepository
  ) {}

  async execute(
    transactionId: string
  ): Promise<void> {

    const transaction =
      await this.transactionRepo
        .findById(
          transactionId
        );

    if (!transaction) {

      throw new AppError(
        "Transaction not found",
        StatusCode.NOT_FOUND
      );
    }

    // Prevent duplicate webhook processing

    if (
      transaction.isSuccess()
    ) {

      return;
    }

    const wallet =
      await this.walletRepo
        .findById(
          transaction.getWalletId()
        );

    if (!wallet) {

      throw new AppError(
        "Wallet not found",
        StatusCode.NOT_FOUND
      );
    }

    // Credit wallet

    wallet.credit(
      transaction.getAmount()
    );

    await this.walletRepo
      .save(wallet);

    // Mark transaction success

    transaction.markSuccess();

    await this.transactionRepo
      .save(transaction);
  }
}
import { WalletTransaction }
from "@domain/entities/WalletTransaction";

import { TransactionType }
from "@domain/enums/TransactionType";

import { TransactionSource }
from "@domain/enums/TransactionSource";

import { IWalletTransactionRepository }
from "@domain/interfaces/IWalletTransactionRepository";

import { ITransactionRefGenerator }
from "@application/interfaces/services/ITransactionRefGenerator";

export interface CreateWalletTransactionDTO {

  walletId: string;

  amount: number;

  type: TransactionType;

  source: TransactionSource;
  description: string;

  stripeSessionId?: string;
}

export class CreateWalletTransactionUseCase {

  constructor(
    private readonly transactionRepo:
      IWalletTransactionRepository,

    private readonly transactionRefGenerator:
      ITransactionRefGenerator
  ) {}

  async execute(
    dto: CreateWalletTransactionDTO
  ): Promise<WalletTransaction> {

    const transactionRef =
      await this.transactionRefGenerator
        .generate();

    const transaction =
      WalletTransaction.create({
        transactionRef,

        walletId:
          dto.walletId,

        amount:
          dto.amount,
      description:
      dto.description,

        type:
          dto.type,

        source:
          dto.source,

        stripeSessionId:
          dto.stripeSessionId,
      });

    return await this.transactionRepo
      .create(transaction);
  }
}
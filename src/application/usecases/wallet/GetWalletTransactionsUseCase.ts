import { IWalletRepository }
from "@domain/interfaces/IWalletRepository";

import { IWalletTransactionRepository }
from "@domain/interfaces/IWalletTransactionRepository";

import { AppError }
from "@common/AppError";

import { StatusCode }
from "@common/enums";

import { GetWalletTransactionsDTO }
from "@application/dtos/wallet/GetWalletTransactionsDTO";

export class GetWalletTransactionsUseCase {

  constructor(
    private readonly walletRepo:
      IWalletRepository,

    private readonly transactionRepo:
      IWalletTransactionRepository
  ) {}

  async execute(
    dto: GetWalletTransactionsDTO
  ) {

    const {
      userId,
      page,
      limit,
    } = dto;

    const wallet =
      await this.walletRepo
        .findByUserId(userId);

    if (!wallet) {

      throw new AppError(
        "Wallet not found",
        StatusCode.NOT_FOUND
      );
    }

    const result =
      await this.transactionRepo
        .findByWalletId(
          wallet.getId(),
          page,
          limit
        );

    return {
      transactions:
        result.transactions,

      total:
        result.total,

      page,

      limit,

      totalPages:
        Math.ceil(
          result.total / limit
        ),
    };
  }
}
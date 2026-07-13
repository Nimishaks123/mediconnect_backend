import { PlatformWalletTransaction } from "@domain/entities/PlatformWalletTransaction";

import { PlatformTransactionType } from "@domain/enums/PlatformTransactionType";

import { PlatformTransactionSource } from "@domain/enums/PlatformTransactionSource";

import { IPlatformWalletTransactionRepository }
from "@domain/interfaces/IPlatformWalletTransactionRepository";
import { ICreatePlatformWalletTransactionUseCase } from "@application/interfaces/platformWallet/ICreatePlatformWalletTransactionUseCase";

import { ITransactionRefGenerator }
from "@application/interfaces/services/ITransactionRefGenerator";
import { CreatePlatformWalletTransactionDTO } from "@application/dtos/wallet/CreatePlatformWalletTransactionDTO";

export class CreatePlatformWalletTransactionUseCase implements ICreatePlatformWalletTransactionUseCase {

  constructor(
    private readonly transactionRepo:
      IPlatformWalletTransactionRepository,

    private readonly transactionRefGenerator:
      ITransactionRefGenerator
  ) {}

  async execute(
    dto: CreatePlatformWalletTransactionDTO
  ): Promise<PlatformWalletTransaction> {

    const transactionRef =
      await this.transactionRefGenerator.generate();

    const transaction =
      PlatformWalletTransaction.create({

        transactionRef,

        walletId:
          dto.walletId,

        appointmentId:
          dto.appointmentId,

        amount:
          dto.amount,

        description:
          dto.description,

        type:
          dto.type,

        source:
          dto.source,
      });

    return await this.transactionRepo.create(
      transaction
    );
  }
}
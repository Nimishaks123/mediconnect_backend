import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

import { IWalletRepository }
from "@domain/interfaces/IWalletRepository";

import { IPaymentService }
from "@application/interfaces/services/IPaymentService";

import { CreateWalletTransactionUseCase }
from "./CreateWalletTransactionUseCase";

import { TransactionType }
from "@domain/enums/TransactionType";

import { TransactionSource }
from "@domain/enums/TransactionSource";

import { Wallet }
from "@domain/entities/Wallet";

import { config }
from "@common/config";

export class CreateWalletTopupSessionUseCase {

  constructor(
    private readonly walletRepo:
      IWalletRepository,

    private readonly paymentService:
      IPaymentService,

    private readonly createTransactionUseCase:
      CreateWalletTransactionUseCase
  ) {}

  async execute(
    userId: string,
    amount: number
  ) {

    if (
      amount <= 0
    ) {
      throw new AppError(
        "Invalid amount",
        StatusCode.BAD_REQUEST
      );
    }

    let wallet =
      await this.walletRepo
        .findByUserId(userId);

    if (!wallet) {

      wallet =
        Wallet.create(userId);

      await this.walletRepo
        .create(wallet);
    }

    const transaction =
      await this.createTransactionUseCase
        .execute({

          walletId:
            wallet.getId(),

          amount,

          description:
            "Wallet Topup",

          type:
            TransactionType.CREDIT,

          source:
            TransactionSource.WALLET_TOPUP,
        });

    const session =
      await this.paymentService
        .createCheckoutSession({

          amount,

          productName:
            "Wallet Topup",

          metadata: {

            type:
              "WALLET_TOPUP",

            userId,

            walletId:
              wallet.getId(),

            transactionId:
              transaction.getId(),
          },

          successUrl:
`${config.frontendUrl}/wallet/success`,

          cancelUrl:
`${config.frontendUrl}/wallet/cancel`,
        });

    return {
      checkoutUrl:
        session.url,

      transactionRef:
        transaction.getTransactionRef(),
    };
  }
}
import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { Wallet } from "@domain/entities/Wallet";
import { TransactionType } from "@domain/enums/TransactionType";
import { TransactionSource } from "@domain/enums/TransactionSource";
import { CreateWalletTransactionUseCase } from "./CreateWalletTransactionUseCase";
import { CreditWalletDTO } from "@application/dtos/wallet/CreditWalletDTO";
import { IWalletTransactionRepository } from "@domain/interfaces/IWalletTransactionRepository";
export class CreditWalletUseCase {

  constructor(
    private readonly walletRepo: IWalletRepository,

    private readonly createWalletTransactionUseCase:
      CreateWalletTransactionUseCase,
      private readonly transactionRepo:
    IWalletTransactionRepository,
  ) {}

  async execute(
    dto: CreditWalletDTO
  ): Promise<void> {
    console.log("credit wallet usecase called",dto);

    const wallet =
      await this.getOrCreateWallet(
        dto.userId
      );

    wallet.credit(
      dto.amount
    );

    await this.walletRepo.save(
      wallet
    );

   const transaction= await this.createWalletTransactionUseCase.execute({

      walletId:
        wallet.getId(),

      amount:
        dto.amount,

      description:
        dto.description,

      type:
        TransactionType.CREDIT,

      source:
        dto.source,
    });
    transaction.markSuccess();
    await this.transactionRepo.save(
  transaction
);
  }

  private async getOrCreateWallet(
    userId: string
  ): Promise<Wallet> {

    let wallet =
      await this.walletRepo.findByUserId(
        userId
      );

    if (!wallet) {

      wallet =
        Wallet.create(userId);

      wallet =
        await this.walletRepo.create(
          wallet
        );
    }

    return wallet;
  }
}
import { IPlatformWalletRepository }
from "@domain/interfaces/IPlatformWalletRepository";

import { PlatformWallet }
from "@domain/entities/PlatformWallet";

import { PlatformTransactionType }
from "@domain/enums/PlatformTransactionType";

import { PlatformTransactionSource }
from "@domain/enums/PlatformTransactionSource";

import { CreatePlatformWalletTransactionUseCase }
from "./CreatePlatformWalletTransactionUseCase";
import { CreditPlatformWalletDTO } from "@application/dtos/wallet/CreditPlatformWalletDTO";
import { ICreditPlatformWalletUseCase } from "@application/interfaces/platformWallet/ICreditPlatformWalletUseCase";
export class CreditPlatformWalletUseCase implements ICreditPlatformWalletUseCase  {

  constructor(
    private readonly walletRepo:
      IPlatformWalletRepository,

    private readonly createTransactionUseCase:
      CreatePlatformWalletTransactionUseCase
  ) {}

  async execute(
    dto: CreditPlatformWalletDTO
  ): Promise<void> {

    let wallet =
      await this.walletRepo.find();

    if (!wallet) {

      wallet =
        PlatformWallet.create();

      wallet.credit(dto.amount);

      wallet =
        await this.walletRepo.create(
          wallet
        );

    } else {

      wallet.credit(dto.amount);

      await this.walletRepo.save(
        wallet
      );
    }
try{
    await this.createTransactionUseCase.execute({

      walletId:
        wallet.getId(),

      appointmentId:
        dto.appointmentId,

      amount:
        dto.amount,

      description:
        dto.description,

      type:
        PlatformTransactionType.CREDIT,

      source:
        PlatformTransactionSource.APPOINTMENT_COMMISSION,
    });
    console.log("Platform transaction created successfully");
  }catch(error){
     console.error("Platform transaction creation failed:", error);
  throw error;
  }
  }
}
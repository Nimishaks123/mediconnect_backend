import { walletRepository,doctorRepository } from "./repositories";
import { paymentService } from "./services";

import { walletTransactionRepository }
from "./repositories"

import { TransactionRefGenerator }
from "@infrastructure/services/TransactionRefGenerator";

import { GetUserWalletUseCase }
from "@application/usecases/wallet/GetUserWalletUseCase";

import { CreateWalletTransactionUseCase }
from "@application/usecases/wallet/CreateWalletTransactionUseCase";

import { CreateWalletTopupSessionUseCase }
from "@application/usecases/wallet/CreateWalletTopupSessionUseCase";
import { GetWalletTransactionsUseCase } from "@application/usecases/wallet/GetWalletTransactionsUseCase";
import { CreditWalletUseCase } from "@application/usecases/wallet/CreditWalletUseCase";
import { CreditDoctorEarningsUseCase }
from "@application/usecases/wallet/CreditDoctorEarningsUseCase";
export const transactionRefGenerator =
  new TransactionRefGenerator();



export const getUserWalletUseCase =
  new GetUserWalletUseCase(
    walletRepository
  );

export const createWalletTransactionUseCase =
  new CreateWalletTransactionUseCase(
    walletTransactionRepository,
    transactionRefGenerator
  );

export const createWalletTopupSessionUseCase =
  new CreateWalletTopupSessionUseCase(
    walletRepository,
    paymentService,
    createWalletTransactionUseCase
  );
 export const getWalletTransactionsUseCase =
  new GetWalletTransactionsUseCase(
    walletRepository,
    walletTransactionRepository
  );
  export const creditWalletUseCase=new CreditWalletUseCase(
    walletRepository,
  
    createWalletTransactionUseCase,
       walletTransactionRepository,

  );
  export const creditDoctorEarningsUseCase =
  new CreditDoctorEarningsUseCase(
    doctorRepository,
    creditWalletUseCase
  );

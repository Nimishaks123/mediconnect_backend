import { walletRepository } from "./repositories";
import { paymentService } from "./services";

import { WalletTransactionRepository }
from "@infrastructure/persistence/WalletTransactionRepository";

import { TransactionRefGenerator }
from "@infrastructure/services/TransactionRefGenerator";

import { GetUserWalletUseCase }
from "@application/usecases/wallet/GetUserWalletUseCase";

import { CreateWalletTransactionUseCase }
from "@application/usecases/wallet/CreateWalletTransactionUseCase";

import { CreateWalletTopupSessionUseCase }
from "@application/usecases/wallet/CreateWalletTopupSessionUseCase";
import { GetWalletTransactionsUseCase } from "@application/usecases/wallet/GetWalletTransactionsUseCase";

export const transactionRefGenerator =
  new TransactionRefGenerator();

export const walletTransactionRepository =
  new WalletTransactionRepository();

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
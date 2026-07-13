import {
  platformWalletRepository,
  platformWalletTransactionRepository,
} from "./repositories";

import { transactionRefGenerator }
from "./walletUsecases";

import { CreatePlatformWalletTransactionUseCase }
from "@application/usecases/wallet/CreatePlatformWalletTransactionUseCase";

import { CreditPlatformWalletUseCase }
from "@application/usecases/wallet/CreditPlatformWalletUseCase";

import { GetPlatformWalletUseCase }
from "@application/usecases/wallet/GetPlatformWalletUseCase";
import { GetPlatformWalletTransactionsUseCase }
from "@application/usecases/wallet/GetPlatformWalletTransactionsUseCase";

export const createPlatformWalletTransactionUseCase =
  new CreatePlatformWalletTransactionUseCase(
    platformWalletTransactionRepository,
    transactionRefGenerator
  );

export const creditPlatformWalletUseCase =
  new CreditPlatformWalletUseCase(
    platformWalletRepository,
    createPlatformWalletTransactionUseCase
  );

export const getPlatformWalletUseCase =
  new GetPlatformWalletUseCase(
    platformWalletRepository
  );

export const getPlatformWalletTransactionsUseCase =
  new GetPlatformWalletTransactionsUseCase(
    platformWalletRepository,
    platformWalletTransactionRepository
  );
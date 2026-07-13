import { PlatformTransactionType } from "@domain/enums/PlatformTransactionType";
import { PlatformTransactionSource } from "@domain/enums/PlatformTransactionSource";
export interface CreatePlatformWalletTransactionDTO {
  walletId: string;

  appointmentId: string;

  amount: number;

  description: string;

  type: PlatformTransactionType;

  source: PlatformTransactionSource;
}
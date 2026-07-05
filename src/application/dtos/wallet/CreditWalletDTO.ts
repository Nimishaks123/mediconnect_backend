import { TransactionSource } from "@domain/enums/TransactionSource";

export interface CreditWalletDTO {
  userId: string;
  amount: number;
  description: string;
  source: TransactionSource;
}
export interface GetPlatformWalletTransactionsDTO {
  page: number;
  limit: number;
}

export interface PlatformWalletTransactionResponseDTO {
  transactionRef: string;
  appointmentId: string;
  amount: number;
  description: string;
  type: string;
  source: string;
  createdAt: Date;
}

export interface GetPlatformWalletTransactionsResponseDTO {
  transactions: PlatformWalletTransactionResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IGetPlatformWalletTransactionsUseCase {
  execute(
    dto: GetPlatformWalletTransactionsDTO
  ): Promise<GetPlatformWalletTransactionsResponseDTO>;
}
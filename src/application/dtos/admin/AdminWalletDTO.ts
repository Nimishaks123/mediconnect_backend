export interface GetAdminWalletsInputDTO {
  page: number;
  limit: number;
  search?: string;
  sort?: "NEWEST" | "OLDEST";
}

export interface AdminWalletListItemDTO {
  userId: string;
  name: string;
  email: string;
  balance: number;
  totalCredits: number;
  totalDebits: number;
}

export interface AdminWalletListResponseDTO {
  data: AdminWalletListItemDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminTransactionListItemDTO {
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  createdAt: string;
}

export interface AdminWalletTransactionsResponseDTO {
  userId: string;
  userName: string;
  userEmail: string;
  balance: number;
  data: AdminTransactionListItemDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

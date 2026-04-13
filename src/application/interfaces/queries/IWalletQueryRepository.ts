import { 
  AdminWalletListItemDTO, 
  AdminTransactionListItemDTO 
} from "../../dtos/admin/AdminWalletDTO";

export interface IWalletQueryRepository {
  findAdminWallets(
    page: number,
    limit: number,
    search?: string,
    sort?: "NEWEST" | "OLDEST"
  ): Promise<{ data: AdminWalletListItemDTO[]; total: number }>;

  findAdminWalletTransactions(
    userId: string,
    page: number,
    limit: number,
    type?: "CREDIT" | "DEBIT",
    search?: string,
    sort?: "NEWEST" | "OLDEST"
  ): Promise<{ 
    data: AdminTransactionListItemDTO[]; 
    total: number;
    balance: number;
    userName: string;
    userEmail: string;
  }>;
}

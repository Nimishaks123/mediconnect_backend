import { IWalletQueryRepository } from "../../interfaces/queries/IWalletQueryRepository";
import { AdminWalletTransactionsResponseDTO } from "../../dtos/admin/AdminWalletDTO";

export interface GetAdminWalletTransactionsInputDTO {
  userId: string;
  page: number;
  limit: number;
  type?: "CREDIT" | "DEBIT";
  search?: string;
  sort?: "NEWEST" | "OLDEST";
}

export class GetAdminWalletTransactionsUseCase {
  constructor(private readonly walletQueryRepo: IWalletQueryRepository) {}

  async execute(input: GetAdminWalletTransactionsInputDTO): Promise<AdminWalletTransactionsResponseDTO> {
    const page = Math.max(1, Number(input.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(input.limit) || 10));
    const { userId, type, search } = input;
    const sort: "NEWEST" | "OLDEST" = input.sort === "OLDEST" ? "OLDEST" : "NEWEST";
    
    const { 
      data, 
      total, 
      balance, 
      userName, 
      userEmail 
    } = await this.walletQueryRepo.findAdminWalletTransactions(
      userId,
      page,
      limit,
      type,
      search,
      sort
    );

    return {
      userId,
      userName,
      userEmail,
      balance,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

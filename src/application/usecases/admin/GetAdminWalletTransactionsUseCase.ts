import { IWalletQueryRepository } from "../../interfaces/queries/IWalletQueryRepository";
import { AdminWalletTransactionsResponseDTO, GetAdminWalletTransactionsInputDTO } from "../../dtos/admin/AdminWalletDTO";
import { IGetAdminWalletTransactionsUseCase } from "../../interfaces/admin/IGetAdminWalletTransactionsUseCase";

export class GetAdminWalletTransactionsUseCase implements IGetAdminWalletTransactionsUseCase {
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

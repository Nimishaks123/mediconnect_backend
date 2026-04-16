import { IWalletQueryRepository } from "../../interfaces/queries/IWalletQueryRepository";
import { IGetAdminWalletsUseCase } from "../../interfaces/admin/IGetAdminWalletsUseCase";
import { GetAdminWalletsInputDTO, AdminWalletListResponseDTO } from "../../dtos/admin/AdminWalletDTO";

export class GetAdminWalletsUseCase implements IGetAdminWalletsUseCase {
  constructor(private readonly walletQueryRepo: IWalletQueryRepository) {}

  async execute(input: GetAdminWalletsInputDTO): Promise<AdminWalletListResponseDTO> {
    const page = Math.max(1, Number(input.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(input.limit) || 10));
    const search = input.search;
    const sort: "NEWEST" | "OLDEST" = (input.sort === "OLDEST" ? "OLDEST" : "NEWEST");
    
    const { data, total } = await this.walletQueryRepo.findAdminWallets(
      page,
      limit,
      search,
      sort
    );

    return {
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

import { AdminWalletTransactionsResponseDTO, GetAdminWalletTransactionsInputDTO } from "../../dtos/admin/AdminWalletDTO";

export interface IGetAdminWalletTransactionsUseCase {
  execute(input: GetAdminWalletTransactionsInputDTO): Promise<AdminWalletTransactionsResponseDTO>;
}

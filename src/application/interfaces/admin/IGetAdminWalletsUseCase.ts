import { GetAdminWalletsInputDTO, AdminWalletListResponseDTO } from "../../dtos/admin/AdminWalletDTO";

export interface IGetAdminWalletsUseCase {
  execute(input: GetAdminWalletsInputDTO): Promise<AdminWalletListResponseDTO>;
}

import { Wallet } from "@domain/entities/Wallet";
import { GetUserWalletDTO } from "../../dtos/wallet/GetUserWalletDTO";

export interface IGetUserWalletUseCase {
  execute(dto: GetUserWalletDTO): Promise<Wallet>;
}

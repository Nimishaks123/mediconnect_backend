import { Wallet } from "@domain/entities/Wallet";
//import { GetUserWalletDTO } from "../../dtos/wallet/GetUserWalletDTO";

export interface IAddFundsUseCase {
  execute(amount:string):Promise<Wallet>;
}

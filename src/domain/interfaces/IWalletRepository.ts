import { Wallet } from "../entities/Wallet";

export interface IWalletRepository {
  findByUserId(userId: string): Promise<Wallet | null>;
  create(wallet: Wallet): Promise<Wallet>;
  save(wallet: Wallet): Promise<void>;
}

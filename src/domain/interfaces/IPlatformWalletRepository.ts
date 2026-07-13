import { PlatformWallet } from "@domain/entities/PlatformWallet";

export interface IPlatformWalletRepository {
  find(): Promise<PlatformWallet | null>;

  create(
    wallet: PlatformWallet
  ): Promise<PlatformWallet>;

  save(
    wallet: PlatformWallet
  ): Promise<void>;
}
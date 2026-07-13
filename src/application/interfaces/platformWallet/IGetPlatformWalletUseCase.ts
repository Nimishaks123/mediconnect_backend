import { PlatformWalletDTO } from "@application/dtos/wallet/PlatformWalletDTO";
export interface IGetPlatformWalletUseCase {
  execute(): Promise<PlatformWalletDTO>;
}
import { Wallet } from "@domain/entities/Wallet";

export class WalletResponseMapper {

  static toResponse(
    wallet: Wallet
  ) {

    return {
      balance:
        wallet.getBalance(),
    };
  }
}
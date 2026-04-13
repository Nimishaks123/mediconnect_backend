import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { Response } from "express";
import { GetUserWalletUseCase } from "@application/usecases/wallet/GetUserWalletUseCase";
import { WalletTransaction } from "@domain/entities/Wallet";
import { StatusCode } from "@common/enums";
import { catchAsync } from "@presentation/utils/catchAsync";
import { WalletMapper } from "../mappers/wallet/WalletMapper";

export class PatientWalletController {
  constructor(private readonly getUserWalletUC: GetUserWalletUseCase) {}

  getWallet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WalletMapper.toGetUserWalletDTO(req);
    const wallet = await this.getUserWalletUC.execute(userId);

    // Sorting transactions in descending order of creation
    const sortedTransactions = [...wallet.getTransactions()].sort(
      (a: WalletTransaction, b: WalletTransaction) => 
        b.createdAt.getTime() - a.createdAt.getTime()
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: {
        balance: wallet.getBalance(),
        transactions: sortedTransactions,
      },
    });
  });
}

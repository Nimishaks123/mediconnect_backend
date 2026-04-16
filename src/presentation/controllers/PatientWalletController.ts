import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { Response } from "express";
import { IGetUserWalletUseCase } from "@application/interfaces/wallet/IGetUserWalletUseCase";
import { StatusCode } from "@common/enums";
import { AppError } from "@common/AppError";
import { catchAsync } from "@presentation/utils/catchAsync";
import { GetUserWalletSchema } from "../validators/wallet.validator";
import { WalletResponseMapper } from "../mappers/wallet/WalletResponseMapper";

export class PatientWalletController {
  constructor(private readonly getUserWalletUC: IGetUserWalletUseCase) {}

  getWallet = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError('User not authenticated', StatusCode.UNAUTHORIZED);
    }

    const dto = GetUserWalletSchema.parse({
      userId: req.user.id,
    });

    const wallet = await this.getUserWalletUC.execute(dto);
    const responseData = WalletResponseMapper.toResponse(wallet);

    res.status(StatusCode.OK).json({
      success: true,
      data: responseData,
    });
  });
}

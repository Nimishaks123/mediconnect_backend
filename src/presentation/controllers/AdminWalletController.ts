import { Request, Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { catchAsync } from "../utils/catchAsync";
import { IGetAdminWalletsUseCase } from "../../application/interfaces/admin/IGetAdminWalletsUseCase";
import { IGetAdminWalletTransactionsUseCase } from "../../application/interfaces/admin/IGetAdminWalletTransactionsUseCase";
import { AdminWalletQuerySchema, AdminWalletTransactionQuerySchema } from "../validators/adminWallet.validator";

export class AdminWalletController {
  constructor(
    private readonly getWalletsUC: IGetAdminWalletsUseCase,
    private readonly getTransactionsUC: IGetAdminWalletTransactionsUseCase
  ) {}

  getWallets = catchAsync(async (req: Request, res: Response) => {
    const validated = AdminWalletQuerySchema.parse(req.query);

    const result = await this.getWalletsUC.execute(validated);

    logger.info("Admin fetched all wallets", { page: validated.page, count: result.data.length });
    res.status(StatusCode.OK).json(result);
  });

  getTransactions = catchAsync(async (req: Request, res: Response) => {
    const validated = AdminWalletTransactionQuerySchema.parse({
      ...req.query,
      userId: req.params.userId
    });

    const result = await this.getTransactionsUC.execute(validated);

    logger.info("Admin fetched wallet transactions", { userId: validated.userId, page: validated.page });
    res.status(StatusCode.OK).json(result);
  });
}

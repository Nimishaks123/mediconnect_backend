import { Request, Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { catchAsync } from "../utils/catchAsync";
import { IGetAdminWalletsUseCase } from "../../application/interfaces/admin/IGetAdminWalletsUseCase";
import { IGetAdminWalletTransactionsUseCase } from "../../application/interfaces/admin/IGetAdminWalletTransactionsUseCase";

export class AdminWalletController {
  constructor(
    private readonly getWalletsUC: IGetAdminWalletsUseCase,
    private readonly getTransactionsUC: IGetAdminWalletTransactionsUseCase
  ) {}
  getWallets = catchAsync(async (req: Request, res: Response) => {
    const result = await this.getWalletsUC.execute(req.query as any);

    logger.info("Admin fetched all wallets", {
      page: req.query.page,
      count: result.data.length
    });

    res.status(StatusCode.OK).json(result);
  });
  getTransactions = catchAsync(async (req: Request, res: Response) => {
    const input = {
      ...req.query,
      userId: req.params.userId,
    };

    const result = await this.getTransactionsUC.execute(input as any);

    logger.info("Admin fetched wallet transactions", {
      userId: req.params.userId,
      page: req.query.page
    });

    res.status(StatusCode.OK).json(result);
  });
}
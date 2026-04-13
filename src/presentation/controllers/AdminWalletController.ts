import { Request, Response } from "express";
import logger from "@common/logger";
import { StatusCode } from "@common/enums";
import { catchAsync } from "../utils/catchAsync";
import { GetAdminWalletsUseCase } from "@application/usecases/admin/GetAdminWalletsUseCase";
import { GetAdminWalletTransactionsUseCase } from "@application/usecases/admin/GetAdminWalletTransactionsUseCase";

export class AdminWalletController {
  constructor(
    private readonly getWalletsUC: GetAdminWalletsUseCase,
    private readonly getTransactionsUC: GetAdminWalletTransactionsUseCase
  ) {}

  getWallets = catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const sort = req.query.sort as any;

    const result = await this.getWalletsUC.execute({ page, limit, search, sort });

    logger.info("Admin fetched all wallets", { page, count: result.data.length });
    res.status(StatusCode.OK).json(result);
  });

  getTransactions = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const type = req.query.type as any;
    const search = req.query.search as string;
    const sort = req.query.sort as any;

    const result = await this.getTransactionsUC.execute({ 
      userId, 
      page, 
      limit, 
      type, 
      search,
      sort
    });

    logger.info("Admin fetched wallet transactions", { userId, page });
    res.status(StatusCode.OK).json(result);
  });
}

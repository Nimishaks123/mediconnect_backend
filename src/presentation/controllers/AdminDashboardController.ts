import { Response } from "express";

import { StatusCode } from "@common/enums";

import { catchAsync } from "@presentation/utils/catchAsync";

import { IGetDashboardOverviewUseCase } from "@application/interfaces/admin/IGetDashboardOverviewUseCase";

export class AdminDashboardController {
  constructor(
    private readonly getDashboardOverviewUC: IGetDashboardOverviewUseCase
  ) {}

  getDashboardOverview = catchAsync(
    async (_req, res: Response) => {
      const dashboard =
        await this.getDashboardOverviewUC.execute();

      res.status(StatusCode.OK).json({
        success: true,
        data: dashboard,
      });
    }
  );
}
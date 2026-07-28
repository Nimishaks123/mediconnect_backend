import { Response } from "express";

import { StatusCode } from "@common/enums";

import { catchAsync } from "@presentation/utils/catchAsync";

import { IGetDashboardOverviewUseCase } from "@application/interfaces/admin/IGetDashboardOverviewUseCase";
import { IGetRevenueTrendUseCase } from "@application/interfaces/admin/IGetRevenueTrendUseCase";
import { IGetAppointmentStatusAnalyticsUseCase } from "@application/interfaces/admin/IGetAppointmentStatusAnalyticsUseCase";

export class AdminDashboardController {
  constructor(
    private readonly getDashboardOverviewUC: IGetDashboardOverviewUseCase,
    private readonly getRevenueTrendUC: IGetRevenueTrendUseCase,
    private readonly getAppointmentStatusAnalyticsUC: IGetAppointmentStatusAnalyticsUseCase
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

  getRevenueTrend = catchAsync(
    async (req, res: Response) => {
      const period = req.query.period as string | undefined;
      const trend =
        await this.getRevenueTrendUC.execute(period);

      res.status(StatusCode.OK).json({
        success: true,
        data: trend,
      });
    }
  );

  getAppointmentStatusAnalytics = catchAsync(
    async (_req, res: Response) => {
      const analytics =
        await this.getAppointmentStatusAnalyticsUC.execute();

      res.status(StatusCode.OK).json({
        success: true,
        data: analytics,
      });
    }
  );
}
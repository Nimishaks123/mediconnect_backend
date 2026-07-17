import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { StatusCode } from "@common/enums";
import { IGetPlatformStatsUseCase } from "@application/interfaces/public/IGetPlatformStatsUseCase";

export class PublicController {
  constructor(private readonly getPlatformStatsUC: IGetPlatformStatsUseCase) {}

  getStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await this.getPlatformStatsUC.execute();
    res.status(StatusCode.OK).json({
      success: true,
      data: stats,
    });
  });
}

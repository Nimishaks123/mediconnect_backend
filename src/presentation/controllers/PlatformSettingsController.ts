import { Request, Response } from "express";

import { catchAsync } from "@presentation/utils/catchAsync";

import { StatusCode } from "@common/enums";

import { IGetPlatformSettingsUseCase } from "@application/interfaces/platformSettings/IGetPlatformSettingsUseCase";
import { IUpdatePlatformSettingsUseCase } from "@application/interfaces/platformSettings/IUpdatePlatformSettingsUseCase";

export class PlatformSettingsController {

  constructor(
    private readonly getPlatformSettingsUseCase:
      IGetPlatformSettingsUseCase,

    private readonly updatePlatformSettingsUseCase:
      IUpdatePlatformSettingsUseCase
  ) {}

  getSettings = catchAsync(

    async (
      req: Request,
      res: Response
    ) => {
         console.log("GET SETTINGS HIT");

      const settings =
        await this
          .getPlatformSettingsUseCase
          .execute();

      res.status(
        StatusCode.OK
      ).json({

        success: true,

        data: {

          platformFee:
            settings.getPlatformFee(),

          refundPercentage:
            settings.getRefundPercentage(),

        },

      });

    }

  );

  updateSettings = catchAsync(

    async (
      req: Request,
      res: Response
    ) => {

      await this
        .updatePlatformSettingsUseCase
        .execute(req.body);

      res.status(
        StatusCode.OK
      ).json({

        success: true,

        message:
          "Platform settings updated successfully",

      });

    }

  );

}
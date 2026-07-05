import { Response } from "express";

import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { catchAsync } from "@presentation/utils/catchAsync";

import { StatusCode } from "@common/enums";
import { AppError } from "@common/AppError";

import { WalletResponseMapper } from "@presentation/mappers/wallet/WalletResponseMapper";

import { IGetUserWalletUseCase } from "@application/interfaces/wallet/IGetUserWalletUseCase";

import { GetWalletTransactionsUseCase } from "@application/usecases/wallet/GetWalletTransactionsUseCase";

import { GetWalletTransactionsDTO } from "@application/dtos/wallet/GetWalletTransactionsDTO";

export class DoctorWalletController {

  constructor(

    private readonly getUserWalletUC:
      IGetUserWalletUseCase,

    private readonly getWalletTransactionsUC:
      GetWalletTransactionsUseCase

  ) {}

  getWallet = catchAsync(

    async (
      req: AuthenticatedRequest,
      res: Response
    ) => {

      if (!req.user?.id) {

        throw new AppError(
          "User not authenticated",
          StatusCode.UNAUTHORIZED
        );
      }

      const wallet =
        await this
          .getUserWalletUC
          .execute({
            userId:
              req.user.id,
          });

      const responseData =
        WalletResponseMapper
          .toResponse(wallet);

      res.status(
        StatusCode.OK
      ).json({
        success: true,
        data: responseData,
      });

    }

  );

  getTransactions = catchAsync(

    async (
      req: AuthenticatedRequest,
      res: Response
    ) => {

      if (!req.user?.id) {

        throw new AppError(
          "User not authenticated",
          StatusCode.UNAUTHORIZED
        );
      }

      const dto: GetWalletTransactionsDTO = {

        userId:
          req.user.id,

        page:
          Number(req.query.page ?? 1),

        limit:
          Number(req.query.limit ?? 10),

      };

      const result =
        await this
          .getWalletTransactionsUC
          .execute(dto);

      res.status(
        StatusCode.OK
      ).json({

        success: true,

        data: result,

      });

    }

  );

}
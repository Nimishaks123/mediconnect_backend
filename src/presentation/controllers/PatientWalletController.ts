import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";
import { Response } from "express";

import { IGetUserWalletUseCase } from "@application/interfaces/wallet/IGetUserWalletUseCase";

import { CreateWalletTopupSessionUseCase } from "@application/usecases/wallet/CreateWalletTopupSessionUseCase";

import { StatusCode } from "@common/enums";
import { AppError } from "@common/AppError";

import { catchAsync } from "@presentation/utils/catchAsync";

import { WalletResponseMapper } from "../mappers/wallet/WalletResponseMapper";
import { GetWalletTransactionsDTO } from "@application/dtos/wallet/GetWalletTransactionsDTO";
import { GetWalletTransactionsUseCase } from "@application/usecases/wallet/GetWalletTransactionsUseCase";

export class PatientWalletController {

  constructor(
  private readonly getUserWalletUC:
    IGetUserWalletUseCase,

  private readonly createWalletTopupSessionUC:
    CreateWalletTopupSessionUseCase,

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
        data:
          responseData,
      });
    }
  );

  topupWallet = catchAsync(
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

      const { amount } =
        req.body;

      const result =
        await this
          .createWalletTopupSessionUC
          .execute(
            req.user.id,
            Number(amount)
          );

      res.status(
        StatusCode.OK
      ).json({
        success: true,
        data: result,
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
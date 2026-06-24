import { Response } from "express";

import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

import { catchAsync } from "@presentation/utils/catchAsync";
import { AuthenticatedRequest } from "@presentation/middlewares/authMiddleware";

import { ICreateReviewUseCase } from "@application/interfaces/review/ICreateReviewUseCase";
import { IGetDoctorReviewsUseCase } from "@application/interfaces/review/IGetDoctorReviewsUseCase";

export class ReviewController {
  constructor(
    private readonly createReviewUC: ICreateReviewUseCase,
    private readonly getDoctorReviewsUC: IGetDoctorReviewsUseCase
  ) {}

  // CREATE REVIEW

  createReview = catchAsync(
    async (
      req: AuthenticatedRequest,
      res: Response
    ) => {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(
          "Unauthorized",
          StatusCode.UNAUTHORIZED
        );
      }

      const {
        appointmentId,
        rating,
        comment,
      } = req.body;

      await this.createReviewUC.execute({
        appointmentId,
        patientId: userId,
        rating,
        comment,
      });

      res.status(StatusCode.CREATED).json({
        success: true,
        message:
          "Review submitted successfully",
      });
    }
  );

  // GET DOCTOR REVIEWS

  getDoctorReviews = catchAsync(
    async (
      req: AuthenticatedRequest,
      res: Response
    ) => {
      const { doctorId } = req.params;

      const data =
        await this.getDoctorReviewsUC.execute(
          doctorId
        );

      res.status(StatusCode.OK).json({
        success: true,
        data,
      });
    }
  );
}
import { Types } from "mongoose";
import { ReviewModel } from "./models/ReviewModel";

import { IReviewQueryRepository } from "@application/interfaces/queries/IReviewQueryRepository";

import { ReviewResponseDTO } from "@application/dtos/review/ReviewResponseDTO";
import { DoctorReviewSummaryDTO } from "@application/dtos/review/DoctorReviewSummaryDTO";

export class ReviewQueryRepository
  implements IReviewQueryRepository
{
    async findDoctorReviews(
  doctorId: string
): Promise<ReviewResponseDTO[]> {
  const reviews =
    await ReviewModel.aggregate([
      {
        $match: {
          doctorId: new Types.ObjectId(
            doctorId
          ),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "patientId",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: "$patient",
      },
      {
        $project: {
              reviewId: "$reviewId",
          patientName: "$patient.name",
          rating: 1,
          comment: 1,
          createdAt: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

  return reviews;
}
async getDoctorReviewSummary(
  doctorId: string
): Promise<DoctorReviewSummaryDTO> {
    const reviews =
  await this.findDoctorReviews(
    doctorId
  );
  const ratingResult =
  await ReviewModel.aggregate([
    {
      $match: {
        doctorId: new Types.ObjectId(
          doctorId
        ),
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: "$rating",
        },
        totalReviews: {
          $sum: 1,
        },
      },
    },
  ]);
  return {
  averageRating:
    ratingResult[0]
      ?.averageRating ?? 0,

  totalReviews:
    ratingResult[0]
      ?.totalReviews ?? 0,

  reviews,
};
}
}
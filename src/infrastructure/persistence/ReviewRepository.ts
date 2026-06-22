import { Types } from "mongoose";
import { Review } from "@domain/entities/Review";
import { IReviewRepository } from "@domain/interfaces/IReviewRepository";
import { ReviewModel } from "../persistence/models/ReviewModel";

export class ReviewRepository
  implements IReviewRepository
{
  async save(review: Review): Promise<void> {
    await ReviewModel.create({
      reviewId: review.getId(),
      appointmentId:
        review.getAppointmentId(),
      doctorId: new Types.ObjectId(
        review.getDoctorId()
      ),
      patientId: new Types.ObjectId(
        review.getPatientId()
      ),
      rating: review.getRating(),
      comment: review.getComment(),
    });
  }

  async findByAppointmentId(
    appointmentId: string
  ): Promise<Review | null> {
    const doc =
      await ReviewModel.findOne({
        appointmentId,
      });

    if (!doc) {
      return null;
    }

    return new Review(
      doc.reviewId,
      doc.appointmentId,
      doc.doctorId.toString(),
      doc.patientId.toString(),
      doc.rating,
      doc.comment,
      doc.createdAt
    );
  }

  async findByDoctorId(
    doctorId: string
  ): Promise<Review[]> {
    const docs =
      await ReviewModel.find({
        doctorId:
          new Types.ObjectId(
            doctorId
          ),
      }).sort({
        createdAt: -1,
      });

    return docs.map(
      (doc) =>
        new Review(
          doc.reviewId,
          doc.appointmentId,
          doc.doctorId.toString(),
          doc.patientId.toString(),
          doc.rating,
          doc.comment,
          doc.createdAt
        )
    );
  }

  async countByDoctorId(
    doctorId: string
  ): Promise<number> {
    return ReviewModel.countDocuments({
      doctorId:
        new Types.ObjectId(
          doctorId
        ),
    });
  }

  async getAverageRating(
    doctorId: string
  ): Promise<number> {
    const result =
      await ReviewModel.aggregate([
        {
          $match: {
            doctorId:
              new Types.ObjectId(
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
          },
        },
      ]);

    return (
      result[0]?.averageRating ??
      0
    );
  }
}
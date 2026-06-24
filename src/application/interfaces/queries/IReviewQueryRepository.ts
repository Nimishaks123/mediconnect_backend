
import { DoctorReviewSummaryDTO } from "@application/dtos/review/DoctorReviewSummaryDTO";
import { ReviewResponseDTO } from "@application/dtos/review/ReviewResponseDTO";

export interface IReviewQueryRepository {
  findDoctorReviews(
    doctorId: string
  ): Promise<ReviewResponseDTO[]>;

  getDoctorReviewSummary(
    doctorId: string
  ): Promise<DoctorReviewSummaryDTO>;
}
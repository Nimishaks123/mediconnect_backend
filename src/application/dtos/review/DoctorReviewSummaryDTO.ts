import { ReviewResponseDTO } from "./ReviewResponseDTO";
export interface DoctorReviewSummaryDTO {
  averageRating: number;
  totalReviews: number;
  reviews: ReviewResponseDTO[];
}
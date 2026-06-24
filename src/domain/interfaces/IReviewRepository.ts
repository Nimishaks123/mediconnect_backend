import { ReviewResponseDTO } from "@application/dtos/review/ReviewResponseDTO";
import { Review } from "@domain/entities/Review";

export interface IReviewRepository {
  save(review: Review): Promise<void>;

  findByAppointmentId(
    appointmentId: string
  ): Promise<Review | null>;

  findByDoctorId(
    doctorId: string
  ): Promise<Review[]>;

  countByDoctorId(
    doctorId: string
  ): Promise<number>;

  getAverageRating(
    doctorId: string
  ): Promise<number>;
}
import { DoctorReviewSummaryDTO } from "@application/dtos/review/DoctorReviewSummaryDTO";

export interface IGetDoctorReviewsUseCase {
  execute(
    doctorId: string
  ): Promise<DoctorReviewSummaryDTO>;
}
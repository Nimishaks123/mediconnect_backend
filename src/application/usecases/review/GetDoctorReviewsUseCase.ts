import { DoctorReviewSummaryDTO } from "@application/dtos/review/DoctorReviewSummaryDTO";
import { IReviewQueryRepository } from "@application/interfaces/queries/IReviewQueryRepository";
import { IGetDoctorReviewsUseCase } from "@application/interfaces/review/IGetDoctorReviewsUseCase";

export class GetDoctorReviewsUseCase
  implements IGetDoctorReviewsUseCase
{
  constructor(
    private readonly reviewQueryRepo: IReviewQueryRepository
  ) {}

  async execute(
    doctorId: string
  ): Promise<DoctorReviewSummaryDTO> {
    return this.reviewQueryRepo.getDoctorReviewSummary(
      doctorId
    );
  }
}
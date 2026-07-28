import { RevenueTrendDTO } from "@application/dtos/admin/RevenueTrendDTO";
import { IDashboardQueryRepository } from "@application/interfaces/queries/IDashboardQueryRepository";
import { IGetRevenueTrendUseCase } from "@application/interfaces/admin/IGetRevenueTrendUseCase";

export class GetRevenueTrendUseCase implements IGetRevenueTrendUseCase {
  constructor(
    private readonly dashboardQueryRepository: IDashboardQueryRepository
  ) {}

  async execute(period?: string): Promise<RevenueTrendDTO> {
    return await this.dashboardQueryRepository.getRevenueTrend(period);
  }
}

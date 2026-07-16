import { DashboardOverviewDTO } from "@application/dtos/admin/DashboardOverviewDTO";
import { IDashboardQueryRepository } from "@application/interfaces/queries/IDashboardQueryRepository";
import { IGetDashboardOverviewUseCase } from "@application/interfaces/admin/IGetDashboardOverviewUseCase";

export class GetDashboardOverviewUseCase implements IGetDashboardOverviewUseCase{
  constructor(
    private readonly dashboardQueryRepository: IDashboardQueryRepository
  ) {}

  async execute(): Promise<DashboardOverviewDTO> {
    return await this.dashboardQueryRepository.getDashboardOverview();
  }
}
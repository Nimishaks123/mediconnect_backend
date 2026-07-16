import { DashboardOverviewDTO } from "@application/dtos/admin/DashboardOverviewDTO";

export interface IGetDashboardOverviewUseCase {
  execute(): Promise<DashboardOverviewDTO>;
}
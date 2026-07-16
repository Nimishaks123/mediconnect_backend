import { DashboardOverviewDTO } from "@application/dtos/admin/DashboardOverviewDTO";

export interface IDashboardQueryRepository {
  getDashboardOverview(): Promise<DashboardOverviewDTO>;
}
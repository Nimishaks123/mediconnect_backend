import { DashboardOverviewDTO } from "@application/dtos/admin/DashboardOverviewDTO";
import { RevenueTrendDTO } from "@application/dtos/admin/RevenueTrendDTO";
import { AppointmentStatusAnalyticsDTO } from "@application/dtos/admin/AppointmentStatusAnalyticsDTO";

export interface IDashboardQueryRepository {
  getDashboardOverview(): Promise<DashboardOverviewDTO>;
  getRevenueTrend(): Promise<RevenueTrendDTO>;
  getAppointmentStatusAnalytics(): Promise<AppointmentStatusAnalyticsDTO>;
}
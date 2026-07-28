import { DashboardOverviewDTO } from "@application/dtos/admin/DashboardOverviewDTO";
import { RevenueTrendDTO } from "@application/dtos/admin/RevenueTrendDTO";
import { AppointmentStatusAnalyticsDTO } from "@application/dtos/admin/AppointmentStatusAnalyticsDTO";
import { AnalyticsReportDTO } from "@application/dtos/admin/AnalyticsReportDTO";
import { AnalyticsReportFilterDTO } from "@application/dtos/admin/AnalyticsReportFilterDTO";

export interface IDashboardQueryRepository {
  getDashboardOverview(): Promise<DashboardOverviewDTO>;
  getRevenueTrend(period?: string): Promise<RevenueTrendDTO>;
  getAppointmentStatusAnalytics(): Promise<AppointmentStatusAnalyticsDTO>;
  getAnalyticsReport(filter?: AnalyticsReportFilterDTO): Promise<AnalyticsReportDTO>;
}
import { GetDashboardOverviewUseCase } from "@application/usecases/admin/GetDashboardOverviewUseCase";
import { GetRevenueTrendUseCase } from "@application/usecases/admin/GetRevenueTrendUseCase";
import { GetAppointmentStatusAnalyticsUseCase } from "@application/usecases/admin/GetAppointmentStatusAnalyticsUseCase";
import {dashboardQueryRepository} from "./repositories"

export const getDashboardOverviewUseCase =
  new GetDashboardOverviewUseCase(
    dashboardQueryRepository
  );

export const getRevenueTrendUseCase =
  new GetRevenueTrendUseCase(
    dashboardQueryRepository
  );

export const getAppointmentStatusAnalyticsUseCase =
  new GetAppointmentStatusAnalyticsUseCase(
    dashboardQueryRepository
  );
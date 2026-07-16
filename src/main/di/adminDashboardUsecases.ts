import { GetDashboardOverviewUseCase } from "@application/usecases/admin/GetDashboardOverviewUseCase";
import {dashboardQueryRepository} from "./repositories"
export const getDashboardOverviewUseCase =
  new GetDashboardOverviewUseCase(
    dashboardQueryRepository
  );
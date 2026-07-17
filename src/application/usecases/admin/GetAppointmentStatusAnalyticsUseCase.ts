import { AppointmentStatusAnalyticsDTO } from "@application/dtos/admin/AppointmentStatusAnalyticsDTO";
import { IDashboardQueryRepository } from "@application/interfaces/queries/IDashboardQueryRepository";
import { IGetAppointmentStatusAnalyticsUseCase } from "@application/interfaces/admin/IGetAppointmentStatusAnalyticsUseCase";

export class GetAppointmentStatusAnalyticsUseCase implements IGetAppointmentStatusAnalyticsUseCase {
  constructor(private readonly dashboardQueryRepository: IDashboardQueryRepository) {}

  async execute(): Promise<AppointmentStatusAnalyticsDTO> {
    return await this.dashboardQueryRepository.getAppointmentStatusAnalytics();
  }
}

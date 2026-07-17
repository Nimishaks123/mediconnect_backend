import { AppointmentStatusAnalyticsDTO } from "@application/dtos/admin/AppointmentStatusAnalyticsDTO";

export interface IGetAppointmentStatusAnalyticsUseCase {
  execute(): Promise<AppointmentStatusAnalyticsDTO>;
}

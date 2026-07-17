import { RecentActivityDTO } from "@application/dtos/doctor/RecentActivityDTO";

export interface IDoctorDashboardQueryRepository {
  getRecentActivity(doctorId: string): Promise<RecentActivityDTO>;
}

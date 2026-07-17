import { RecentActivityDTO } from "@application/dtos/doctor/RecentActivityDTO";
import { IDoctorDashboardQueryRepository } from "@application/interfaces/queries/IDoctorDashboardQueryRepository";
import { IGetRecentActivityUseCase } from "@application/interfaces/doctor/IGetRecentActivityUseCase";

export class GetRecentActivityUseCase implements IGetRecentActivityUseCase {
  constructor(private readonly doctorDashboardQueryRepository: IDoctorDashboardQueryRepository) {}

  async execute(doctorId: string): Promise<RecentActivityDTO> {
    return await this.doctorDashboardQueryRepository.getRecentActivity(doctorId);
  }
}

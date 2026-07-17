import { RecentActivityDTO } from "@application/dtos/doctor/RecentActivityDTO";

export interface IGetRecentActivityUseCase {
  execute(doctorId: string): Promise<RecentActivityDTO>;
}

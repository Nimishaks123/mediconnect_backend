import { PlatformStatsDTO } from "@application/dtos/public/PlatformStatsDTO";

export interface IPublicQueryRepository {
  getPlatformStats(): Promise<PlatformStatsDTO>;
}

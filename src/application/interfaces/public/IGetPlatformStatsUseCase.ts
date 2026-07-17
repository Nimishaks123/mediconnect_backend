import { PlatformStatsDTO } from "@application/dtos/public/PlatformStatsDTO";

export interface IGetPlatformStatsUseCase {
  execute(): Promise<PlatformStatsDTO>;
}

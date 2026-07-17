import { GetPlatformStatsUseCase } from "@application/usecases/public/GetPlatformStatsUseCase";
import { publicQueryRepository } from "./repositories";

export const getPlatformStatsUseCase = new GetPlatformStatsUseCase(publicQueryRepository);

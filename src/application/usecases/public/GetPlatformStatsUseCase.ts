import { IGetPlatformStatsUseCase } from "@application/interfaces/public/IGetPlatformStatsUseCase";
import { IPublicQueryRepository } from "@application/interfaces/queries/IPublicQueryRepository";
import { PlatformStatsDTO } from "@application/dtos/public/PlatformStatsDTO";

export class GetPlatformStatsUseCase implements IGetPlatformStatsUseCase {
  constructor(private readonly publicQueryRepository: IPublicQueryRepository) {}

  async execute(): Promise<PlatformStatsDTO> {
    return await this.publicQueryRepository.getPlatformStats();
  }
}

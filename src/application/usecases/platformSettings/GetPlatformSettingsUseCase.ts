import { PlatformSettings } from "@domain/entities/PlatformSettings";
import { IPlatformSettingsRepository } from "@domain/interfaces/IPlatformSettingsRepository";

import { IGetPlatformSettingsUseCase } from "@application/interfaces/platformSettings/IGetPlatformSettingsUseCase";

export class GetPlatformSettingsUseCase
  implements IGetPlatformSettingsUseCase
{
  constructor(
    private readonly platformSettingsRepository:
      IPlatformSettingsRepository
  ) {}

  async execute(): Promise<PlatformSettings> {

    return await this.platformSettingsRepository.getSettings();

  }
}
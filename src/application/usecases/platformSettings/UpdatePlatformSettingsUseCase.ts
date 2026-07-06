import { UpdatePlatformSettingsDTO } from "@application/dtos/platformSettings/UpdatePlatformSettingsDTO";

import { IUpdatePlatformSettingsUseCase } from "@application/interfaces/platformSettings/IUpdatePlatformSettingsUseCase";

import { IPlatformSettingsRepository } from "@domain/interfaces/IPlatformSettingsRepository";

import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";

export class UpdatePlatformSettingsUseCase
  implements IUpdatePlatformSettingsUseCase
{
  constructor(
    private readonly platformSettingsRepository:
      IPlatformSettingsRepository
  ) {}

  async execute(
    dto: UpdatePlatformSettingsDTO
  ): Promise<void> {

   if (dto.platformFee <= 0) {

  throw new AppError(
    "Platform fee must be greater than 0",
    StatusCode.BAD_REQUEST
  );

}

if (
  dto.refundPercentage <= 0 ||
  dto.refundPercentage > 100
) {

  throw new AppError(
    "Refund percentage must be between 1 and 100",
    StatusCode.BAD_REQUEST
  );

}
    const settings =
      await this.platformSettingsRepository.getSettings();

    settings.update({

      platformFee:
        dto.platformFee,

      refundPercentage:
        dto.refundPercentage,

    });

    await this.platformSettingsRepository.save(
      settings
    );
  }
}
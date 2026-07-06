import { UpdatePlatformSettingsDTO } from "@application/dtos/platformSettings/UpdatePlatformSettingsDTO";

export interface IUpdatePlatformSettingsUseCase {

  execute(
    dto: UpdatePlatformSettingsDTO
  ): Promise<void>;

}
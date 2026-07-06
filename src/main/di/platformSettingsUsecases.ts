import { platformSettingsRepository }
from "./repositories";

import { GetPlatformSettingsUseCase }
from "@application/usecases/platformSettings/GetPlatformSettingsUseCase";

import { UpdatePlatformSettingsUseCase }
from "@application/usecases/platformSettings/UpdatePlatformSettingsUseCase";

export const getPlatformSettingsUseCase =
  new GetPlatformSettingsUseCase(
    platformSettingsRepository
  );

export const updatePlatformSettingsUseCase =
  new UpdatePlatformSettingsUseCase(
    platformSettingsRepository
  );
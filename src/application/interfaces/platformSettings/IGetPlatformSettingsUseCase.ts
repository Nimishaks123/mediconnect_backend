import { PlatformSettings } from "@domain/entities/PlatformSettings";

export interface IGetPlatformSettingsUseCase {

  execute(): Promise<PlatformSettings>;

}
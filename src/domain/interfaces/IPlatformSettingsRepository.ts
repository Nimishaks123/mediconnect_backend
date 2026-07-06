import { PlatformSettings } from "@domain/entities/PlatformSettings";

export interface IPlatformSettingsRepository {

  getSettings(): Promise<PlatformSettings>;
  save(
    settings: PlatformSettings
  ): Promise<void>;
}
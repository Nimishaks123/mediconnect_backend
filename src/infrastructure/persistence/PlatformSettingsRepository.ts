import { PlatformSettings } from "@domain/entities/PlatformSettings";
import { IPlatformSettingsRepository } from "@domain/interfaces/IPlatformSettingsRepository";

import { PlatformSettingsModel } from "./models/PlatformSettingsModel";

export class PlatformSettingsRepository
  implements IPlatformSettingsRepository
{
  async getSettings(): Promise<PlatformSettings> {

    let doc =
      await PlatformSettingsModel.findOne();

    if (!doc) {

      doc =
        await PlatformSettingsModel.create({

          platformFee: 50,

          refundPercentage: 75,

        });

    }

    return PlatformSettings.rehydrate({

      id:
        doc._id.toString(),

      platformFee:
        doc.platformFee,

      refundPercentage:
        doc.refundPercentage,

    });
  }

  async save(
    settings: PlatformSettings
  ): Promise<void> {

    await PlatformSettingsModel.updateOne(

      {
        _id: settings.getId(),
      },

      {
        $set: {

          platformFee:
            settings.getPlatformFee(),

          refundPercentage:
            settings.getRefundPercentage(),

        },
      }

    );
  }
}
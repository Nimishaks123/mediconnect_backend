import { AppError } from "@common/AppError";
import { IPlatformSettingsRepository } from "@domain/interfaces/IPlatformSettingsRepository";
import { StatusCode } from "@common/enums";

import { CreditDoctorEarningsDTO } from "@application/dtos/wallet/CreditDoctorEarningsDTO";

import { CreditWalletUseCase } from "./CreditWalletUseCase";

import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { TransactionSource } from "@domain/enums/TransactionSource";
import { ICreditDoctorEarningsUseCase }
from "@application/interfaces/wallet/ICreditDoctorEarningsUseCase";
export class CreditDoctorEarningsUseCase implements ICreditDoctorEarningsUseCase {

  constructor(

    private readonly doctorRepository:
      IDoctorRepository,

    private readonly creditWalletUseCase:
      CreditWalletUseCase,
      private readonly platformSettingsRepository:
    IPlatformSettingsRepository

  ) {}

  async execute(
    dto: CreditDoctorEarningsDTO
  ): Promise<void> {

    const doctor =
      await this.doctorRepository.findById(
        dto.doctorId
      );

    if (!doctor) {

      throw new AppError(
        "Doctor not found",
        StatusCode.NOT_FOUND
      );
    }

    const settings =
  await this.platformSettingsRepository.getSettings();

const earning =
  dto.appointmentAmount -
  settings.getPlatformFee();

    if (earning <= 0) {

      throw new AppError(
        "Invalid doctor earning amount",
        StatusCode.BAD_REQUEST
      );
    }

    await this.creditWalletUseCase.execute({

      userId:
        doctor.getUserId(),

      amount:
        earning,

      description:
        `Consultation earnings for appointment ${dto.appointmentId}`,

      source:
        TransactionSource.DOCTOR_EARNING,
    });

  }

}
import { AppError } from "@common/AppError";
import { config } from "@common/config";
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
      CreditWalletUseCase

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

    const earning =
      dto.appointmentAmount -
      config.platformCommission;

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
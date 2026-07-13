import { IAutoCompleteAppointmentsUseCase }
from "@application/interfaces/appointment/IAutoCompleteAppointmentsUseCase";

import { IAppointmentRepository }
from "@domain/interfaces/IAppointmentRepository";

import { ICreditDoctorEarningsUseCase }
from "@application/interfaces/wallet/ICreditDoctorEarningsUseCase";

import { ICreditPlatformWalletUseCase }
from "@application/interfaces/platformWallet/ICreditPlatformWalletUseCase";

import logger
from "@common/logger";

export class AutoCompleteAppointmentsUseCase
  implements IAutoCompleteAppointmentsUseCase {

  constructor(
    private readonly appointmentRepo:
      IAppointmentRepository,

    private readonly creditDoctorEarningsUseCase:
      ICreditDoctorEarningsUseCase,

    private readonly creditPlatformWalletUseCase:
      ICreditPlatformWalletUseCase
  ) {}

  async execute(): Promise<number> {

    const appointments =
      await this.appointmentRepo
        .findAppointmentsForCompletion();

    let completedCount = 0;

    for (const appointment of appointments) {

      try {

        if (!appointment.isPast()) {
          continue;
        }

      const previousStatus =
  appointment.getStatus();

appointment.complete();

const newStatus =
  appointment.getStatus();

const updated =
  await this.appointmentRepo.updateStatus(
    appointment.getId(),
    previousStatus,
    newStatus
  );

if (!updated) {
  continue;
}

        const revenue =
          await this.creditDoctorEarningsUseCase.execute({

            doctorId:
              appointment.getDoctorId(),

            appointmentId:
              appointment.getBookingId(),

            appointmentAmount:
              appointment.getPrice(),
          });

        await this.creditPlatformWalletUseCase.execute({

          amount:
            revenue.platformFee,

          appointmentId:
            appointment.getBookingId(),

          description:
            `Platform commission for appointment ${appointment.getBookingId()}`
        });

        completedCount++;

      } catch (error) {

        logger.error(
          `Failed to auto-complete appointment ${appointment.getBookingId()}`,
          error
        );
      }
    }

    return completedCount;
  }
}
import { IAutoCompleteAppointmentsUseCase }
from "@application/interfaces/appointment/IAutoCompleteAppointmentsUseCase";

import { IAppointmentRepository }
from "@domain/interfaces/IAppointmentRepository";

import { ICompleteConsultationSessionUseCase }
from "@application/interfaces/appointment/ICompleteConsultationSessionUseCase";

import logger
from "@common/logger";

export class AutoCompleteAppointmentsUseCase
  implements IAutoCompleteAppointmentsUseCase {

  constructor(
    private readonly appointmentRepo:
      IAppointmentRepository,

    private readonly completeConsultationSessionUC?:
      ICompleteConsultationSessionUseCase
  ) {}

  async execute(): Promise<number> {
    let count = 0;

    const unstartedAppointments =
      await this.appointmentRepo.findPastUnstartedAppointments();

    for (const appointment of unstartedAppointments) {
      try {
        if (!appointment.isPast()) {
          continue;
        }

        const previousStatus = appointment.getStatus();
        appointment.markNoSession();
        const newStatus = appointment.getStatus();

        const updated = await this.appointmentRepo.updateStatus(
          appointment.getId(),
          previousStatus,
          newStatus
        );

        if (updated) {
          count++;
        }
      } catch (error) {
        logger.error(
          `Failed to process NO_SESSION for appointment ${appointment.getBookingId()}`,
          error
        );
      }
    }

    if (this.completeConsultationSessionUC) {
      const inProgressAppointments =
        await this.appointmentRepo.findPastInProgressAppointments();

      for (const appointment of inProgressAppointments) {
        try {
          if (!appointment.isPast()) {
            continue;
          }

          const completed = await this.completeConsultationSessionUC.execute({
            appointmentId: appointment.getId(),
          });

          if (completed) {
            count++;
          }
        } catch (error) {
          logger.error(
            `Failed to auto-complete past IN_PROGRESS appointment ${appointment.getBookingId()}`,
            error
          );
        }
      }
    }

    return count;
  }
}
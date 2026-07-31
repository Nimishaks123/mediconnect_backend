import { IAutoCompleteAppointmentsUseCase }
from "@application/interfaces/appointment/IAutoCompleteAppointmentsUseCase";

import { IAppointmentRepository }
from "@domain/interfaces/IAppointmentRepository";

import logger
from "@common/logger";

export class AutoCompleteAppointmentsUseCase
  implements IAutoCompleteAppointmentsUseCase {

  constructor(
    private readonly appointmentRepo:
      IAppointmentRepository
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

    return count;
  }
}
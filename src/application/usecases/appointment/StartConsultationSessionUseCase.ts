import { IStartConsultationSessionUseCase }
from "@application/interfaces/appointment/IStartConsultationSessionUseCase";

import { IAppointmentRepository }
from "@domain/interfaces/IAppointmentRepository";

import { AppointmentStatus }
from "@domain/enums/AppointmentStatus";

import logger from "@common/logger";

export class StartConsultationSessionUseCase
  implements IStartConsultationSessionUseCase {

  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(dto: { appointmentId: string }): Promise<boolean> {
    const appointment = await this.appointmentRepo.findById(dto.appointmentId);

    if (!appointment) {
      logger.warn(`StartConsultationSession: Appointment ${dto.appointmentId} not found`);
      return false;
    }

    if (appointment.getStatus() === AppointmentStatus.IN_PROGRESS) {
      return true;
    }

    if (
      appointment.getStatus() !== AppointmentStatus.CONFIRMED &&
      appointment.getStatus() !== AppointmentStatus.RESCHEDULED
    ) {
      logger.warn(
        `StartConsultationSession: Cannot start session for appointment ${dto.appointmentId} in status ${appointment.getStatus()}`
      );
      return false;
    }

    const previousStatus = appointment.getStatus();
    appointment.startSession();
    const newStatus = appointment.getStatus();

    const updated = await this.appointmentRepo.updateStatus(
      appointment.getId(),
      previousStatus,
      newStatus
    );

    if (updated) {
      logger.info(`Appointment ${dto.appointmentId} transitioned to IN_PROGRESS`);
    }

    return updated;
  }
}

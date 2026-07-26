import { ICompleteConsultationSessionUseCase }
from "@application/interfaces/appointment/ICompleteConsultationSessionUseCase";

import { IAppointmentRepository }
from "@domain/interfaces/IAppointmentRepository";

import { ICreditDoctorEarningsUseCase }
from "@application/interfaces/wallet/ICreditDoctorEarningsUseCase";

import { ICreditPlatformWalletUseCase }
from "@application/interfaces/platformWallet/ICreditPlatformWalletUseCase";

import { AppointmentStatus }
from "@domain/enums/AppointmentStatus";

import logger from "@common/logger";

export class CompleteConsultationSessionUseCase
  implements ICompleteConsultationSessionUseCase {

  constructor(
    private readonly appointmentRepo:
      IAppointmentRepository,

    private readonly creditDoctorEarningsUseCase:
      ICreditDoctorEarningsUseCase,

    private readonly creditPlatformWalletUseCase:
      ICreditPlatformWalletUseCase
  ) {}

  async execute(dto: { appointmentId: string }): Promise<boolean> {
    const appointment = await this.appointmentRepo.findById(dto.appointmentId);

    if (!appointment) {
      logger.warn(`CompleteConsultationSession: Appointment ${dto.appointmentId} not found`);
      return false;
    }

    if (appointment.getStatus() === AppointmentStatus.COMPLETED) {
      return true;
    }

    if (appointment.getStatus() !== AppointmentStatus.IN_PROGRESS) {
      logger.warn(
        `CompleteConsultationSession: Cannot complete appointment ${dto.appointmentId} in status ${appointment.getStatus()}`
      );
      return false;
    }

    const previousStatus = appointment.getStatus();
    appointment.complete();
    const newStatus = appointment.getStatus();

    const updated = await this.appointmentRepo.updateStatus(
      appointment.getId(),
      previousStatus,
      newStatus
    );

    if (!updated) {
      return false;
    }

    try {
      const revenue = await this.creditDoctorEarningsUseCase.execute({
        doctorId: appointment.getDoctorId(),
        appointmentId: appointment.getBookingId(),
        appointmentAmount: appointment.getPrice(),
      });

      await this.creditPlatformWalletUseCase.execute({
        amount: revenue.platformFee,
        appointmentId: appointment.getBookingId(),
        description: `Platform commission for appointment ${appointment.getBookingId()}`
      });

      logger.info(`Appointment ${dto.appointmentId} completed and settled successfully`);
    } catch (error) {
      logger.error(
        `Failed to settle wallets for completed appointment ${appointment.getBookingId()}`,
        error
      );
    }

    return true;
  }
}

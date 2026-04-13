import { WalletService } from "@application/services/WalletService";
import { PatientCancelledAppointmentEvent } from "@domain/events/PatientCancelledAppointmentEvent";

export class WalletRefundHandler {
  constructor(private readonly walletService: WalletService) {}

  async handle(event: PatientCancelledAppointmentEvent): Promise<void> {
    if (event.refundAmount > 0) {
      await this.walletService.creditAmount(
        event.patientId,
        event.refundAmount,
        `Refund for cancelled appointment ${event.appointmentId}`
      );
    }
  }
}

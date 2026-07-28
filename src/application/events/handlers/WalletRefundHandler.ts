import { CreditWalletUseCase } from "@application/usecases/wallet/CreditWalletUseCase";
import { TransactionSource } from "@domain/enums/TransactionSource";
import { PatientCancelledAppointmentEvent } from "@domain/events/PatientCancelledAppointmentEvent";

export class WalletRefundHandler {

  constructor(
    private readonly creditWalletUseCase: CreditWalletUseCase
  ) {}

  async handle(
    event: PatientCancelledAppointmentEvent
  ): Promise<void> {
       console.log("===== WalletRefundHandler =====");
    console.log(event);

    if (event.refundAmount <= 0) {
       console.log("Refund amount is 0. Skipping refund.");
      return;
    }
        console.log("Calling CreditWalletUseCase...");

    await this.creditWalletUseCase.execute({
      userId: event.patientId,

      amount: event.refundAmount,

      description:
        `Refund for cancelled appointment ${event.appointmentId}`,

      source:
        TransactionSource.APPOINTMENT_REFUND,
    });
     console.log("CreditWalletUseCase completed.");
  }
}
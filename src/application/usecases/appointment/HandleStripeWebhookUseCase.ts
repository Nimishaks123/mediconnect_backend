import Stripe from "stripe";

import {
  IConfirmAppointmentUseCase,
} from "@application/interfaces/appointment/IConfirmAppointmentUseCase";

import {
  ProcessWalletTopupWebhookUseCase,
} from "@application/usecases/wallet/ProcessWalletTopupWebhookUseCase";

import logger from "@common/logger";

export class HandleStripeWebhookUseCase {

  constructor(
    private readonly confirmAppointmentUC:
      IConfirmAppointmentUseCase,

    private readonly processWalletTopupUC:
      ProcessWalletTopupWebhookUseCase
  ) {}

  async execute(
    event: Stripe.Event
  ): Promise<void> {

    logger.info(
      `Processing Stripe event: ${event.type}`
    );

    switch (event.type) {

      case "checkout.session.completed": {

       const session =
  event.data.object as Stripe.Checkout.Session;

        const type =
          session.metadata?.type;

        // Appointment payment

        if (
          type ===
          "APPOINTMENT_PAYMENT"
        ) {

          const appointmentId =
            session.metadata
              ?.appointmentId;

          if (appointmentId) {

            logger.info(
              `Confirming appointment ${appointmentId}`
            );

            await this
              .confirmAppointmentUC
              .execute({
                appointmentId,
              });
          }

          break;
        }

        // Wallet topup

        if (
          type ===
          "WALLET_TOPUP"
        ) {

          const transactionId =
            session.metadata
              ?.transactionId;

          if (!transactionId) {

            logger.warn(
              "Wallet topup missing transactionId"
            );

            break;
          }

          logger.info(
            `Processing wallet topup ${transactionId}`
          );

          await this
            .processWalletTopupUC
            .execute(
              transactionId
            );

          break;
        }

        logger.warn(
          `Unknown checkout session type: ${type}`
        );

        break;
      }

      case "payment_intent.succeeded": {

        logger.info(
          "Payment intent succeeded"
        );

        break;
      }

      default:

        logger.info(
          `Unhandled event type ${event.type}`
        );
    }
  }
}
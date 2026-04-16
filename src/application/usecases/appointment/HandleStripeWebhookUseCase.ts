import Stripe from "stripe";
import { IConfirmAppointmentUseCase } from "@application/interfaces/appointment/IConfirmAppointmentUseCase";
import logger from "@common/logger";

export class HandleStripeWebhookUseCase {
  constructor(
    private readonly confirmAppointmentUC: IConfirmAppointmentUseCase
  ) {}

  async execute(event: Stripe.Event): Promise<void> {
    logger.info(`Processing Stripe event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const appointmentId = session.metadata?.appointmentId;

        console.log("Session metadata:", session.metadata);

        if (appointmentId) {
          console.log("Updating appointment:", appointmentId);
          await this.confirmAppointmentUC.execute({ appointmentId });
        } else {
          logger.warn("No appointmentId found in session metadata");
        }
        break;
      }

      case "payment_intent.succeeded": {
        // Optional: you can handle this if needed, but checkout.session.completed is usually enough for checkout
        logger.info("Payment intent succeeded");
        break;
      }

      default:
        logger.info(`Unhandled event type ${event.type}`);
    }
  }
}

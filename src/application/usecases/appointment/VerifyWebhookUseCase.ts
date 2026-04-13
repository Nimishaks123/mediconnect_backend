import { IPaymentService } from "@application/interfaces/services/IPaymentService";
import Stripe from "stripe";

export class VerifyWebhookUseCase {
  constructor(private readonly paymentService: IPaymentService) {}

  execute(payload: any, signature: string): Stripe.Event {
    return this.paymentService.verifyWebhook(payload, signature);
  }
}

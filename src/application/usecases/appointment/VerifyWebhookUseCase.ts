import { IPaymentService } from "@application/interfaces/services/IPaymentService";
import Stripe from "stripe";
import { IVerifyWebhookUseCase } from "@application/interfaces/appointment/IVerifyWebhookUseCase";

export class VerifyWebhookUseCase implements IVerifyWebhookUseCase {
  constructor(private readonly paymentService: IPaymentService) {}

  execute(payload: any, signature: string): Stripe.Event {
    return this.paymentService.verifyWebhook(payload, signature);
  }
}

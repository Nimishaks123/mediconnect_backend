import { IPaymentService } from "@application/interfaces/services/IPaymentService";
import Stripe from "stripe";
import { IVerifyWebhookUseCase } from "@application/interfaces/appointment/IVerifyWebhookUseCase";

export class VerifyWebhookUseCase implements IVerifyWebhookUseCase {
  constructor(private readonly paymentService: IPaymentService) {}

async execute(
  payload: any,
  signature: string
): Promise<Stripe.Event> {

  return await this.paymentService.verifyWebhook(
    payload,
    signature
  );

}
}
import Stripe from "stripe";

export interface IVerifyWebhookUseCase {
  execute(payload: any, signature: string): Promise<Stripe.Event>;
}

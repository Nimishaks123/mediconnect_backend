import Stripe from "stripe";

export interface IHandleStripeWebhookUseCase {
  execute(event: Stripe.Event): Promise<void>;
}

import Stripe from "stripe";


export interface CreateCheckoutSessionInput {
  appointmentId: string;
  patientId: string;
  amount: number;
}

export interface IPaymentService {
  createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<Stripe.Checkout.Session>;

  verifyWebhook(
    payload: any,
    signature: string
  ): Stripe.Event;
}

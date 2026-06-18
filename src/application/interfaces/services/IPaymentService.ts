// import Stripe from "stripe";


// export interface CreateCheckoutSessionInput {
//   appointmentId: string;
//   patientId: string;
//   amount: number;
// }

// export interface IPaymentService {
//   createCheckoutSession(
//     input: CreateCheckoutSessionInput
//   ): Promise<Stripe.Checkout.Session>;

//   verifyWebhook(
//     payload: any,
//     signature: string
//   ): Stripe.Event;
// }
import Stripe from "stripe";

export interface CheckoutSessionDTO {
  amount: number;

  productName: string;

  metadata: Record<string, string>;

  successUrl: string;

  cancelUrl: string;
}

export interface IPaymentService {
  createCheckoutSession(
    dto: CheckoutSessionDTO
  ): Promise<Stripe.Checkout.Session>;

  verifyWebhook(
    payload: any,
    signature: string
  ): Stripe.Event;
}
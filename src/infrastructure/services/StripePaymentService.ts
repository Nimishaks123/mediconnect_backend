import Stripe from "stripe";

import { IPaymentService } from "@application/interfaces/services/IPaymentService";
import { config } from "@common/config";

export class StripePaymentService implements IPaymentService {
  private stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: "2026-01-28.clover", // match your Stripe account version
  });

  async createCheckoutSession({
    appointmentId,
    patientId,
    amount,
  }: {
    appointmentId: string;
    patientId: string;
    amount: number;
  }) {
    // ✅ HARD GUARD (prevents silent Stripe failures)
    if (!config.frontendUrl.startsWith("http")) {
      throw new Error(`Invalid FRONTEND_URL: ${config.frontendUrl}`);
    }

    const successUrl = `${config.frontendUrl}/payment-success/${appointmentId}`;
    const cancelUrl = `${config.frontendUrl}/payment-cancelled`;

    console.log("STRIPE SUCCESS URL =", successUrl);
    console.log("STRIPE CANCEL URL =", cancelUrl);

    return this.stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Doctor Appointment",
            },
            unit_amount: amount * 100, // Converts flat rupees into paise/cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId,
        patientId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  verifyWebhook(payload: any, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripeWebhookSecret
    );
  }
}

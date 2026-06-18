import Stripe from "stripe";

import {
  IPaymentService,
  CheckoutSessionDTO,
} from "@application/interfaces/services/IPaymentService";

import { config } from "@common/config";

export class StripePaymentService
  implements IPaymentService {

  private stripe = new Stripe(
    config.stripeSecretKey,
    {
      apiVersion: "2026-01-28.clover",
    }
  );

  async createCheckoutSession(
    dto: CheckoutSessionDTO
  ): Promise<Stripe.Checkout.Session> {

    if (
      !config.frontendUrl.startsWith(
        "http"
      )
    ) {
      throw new Error(
        `Invalid FRONTEND_URL: ${config.frontendUrl}`
      );
    }

    return this.stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: [
        "card",
      ],

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name:
                dto.productName,
            },

            unit_amount:
              dto.amount * 100,
          },

          quantity: 1,
        },
      ],

      metadata:
        dto.metadata,

      success_url:
        dto.successUrl,

      cancel_url:
        dto.cancelUrl,
    });
  }

  verifyWebhook(
    payload: any,
    signature: string
  ): Stripe.Event {

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripeWebhookSecret
    );
  }
}
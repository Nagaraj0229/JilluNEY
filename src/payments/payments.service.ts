// src/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not defined');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async createPaymentIntent(amount: number, currency = 'usd') {
    return this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: { enabled: true },
    });
  }

  constructWebhookEvent(payload: Buffer, signature: string, secret: string) {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}

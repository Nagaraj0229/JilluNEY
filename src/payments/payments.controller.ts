// src/payments/payments.controller.ts
import { Controller, Post, Req, Res, Headers, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private ordersService: OrdersService,
  ) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: any,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody; // we'll set this in main.ts
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set.');
    }

    let event: Stripe.Event;

    try {
      event = this.paymentsService.constructWebhookEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle event types
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const order = await this.ordersService.markOrderPaid(paymentIntent.id);
      console.log('✅ Order marked as paid:', order?._id);
    }

    return res.send({ received: true });
  }
}

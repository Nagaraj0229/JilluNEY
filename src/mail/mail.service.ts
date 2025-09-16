// src/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Order } from '../orders/schemas/order.schema';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // change if using SMTP/SendGrid
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendOrderStatusMail(order: Order) {
    const itemsHtml = order.items
      .map(
        (item: any) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${item.productId.name}</td>
          <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #ddd;">$${item.productId.price}</td>
        </tr>
      `,
      )
      .join('');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;">
        <h2 style="color:#333;">Order Update</h2>
        <p>Hello,</p>
        <p>Your order <b>#${order._id}</b> is now <b style="color:green;">${order.status}</b>.</p>

        <h3>Order Details:</h3>
        <table style="border-collapse:collapse;width:100%;margin-top:10px;">
          <thead>
            <tr style="background:#f9f9f9;">
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Product</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top:20px;font-size:16px;">
          <b>Total: $${order.total}</b>
        </p>

        <p style="margin-top:20px;">Thank you for shopping with us!</p>
        <p>— My Shop Team</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"My Shop" <${process.env.MAIL_USER}>`,
      to: order.userEmail,
      subject: `Your order #${order._id} is now ${order.status}`,
      html,
    });
  }
}

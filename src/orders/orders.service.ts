// src/orders/orders.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
// import { Product } from '../products/schemas/product.schema';
import { PaymentsService } from '../payments/payments.service';
import { MailerService } from 'src/mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private cartService: CartService,
    private paymentsService: PaymentsService,
    private emailService: MailerService,
  ) {}

  async createOrder(userId: string, paymentMethod: string, email: string) {
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const total = cart.items.reduce(
      (sum, item: any) => sum + item.product.price * item.quantity,
      0,
    );

    let paymentIntentId: string | null = null;
    if (paymentMethod === 'stripe') {
      const intent = await this.paymentsService.createPaymentIntent(total);
      paymentIntentId = intent.id;
    }

    // keep your existing order creation, just add payment fields
    const order = new this.orderModel({
      userId,
      items: cart.items.map((i: any) => ({
        productId: i.product._id,
        quantity: i.quantity,
      })),
      total,
      status: 'pending',
      paymentMethod,
      paymentIntentId, // ✅ new
      userEmail: email,
    });

    await order.save();
    await this.cartService.clearCart(userId);

    return order;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).populate('items.productId').exec();
  }

  async getOrderById(userId: string, id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('items.productId');
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('This order does not belong to you');
    }
    return order;
  }

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(orderId, { status }, { new: true })
      .populate('items.productId');

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    // Send email notification
    await this.emailService.sendOrderStatusMail(updatedOrder);

    return updatedOrder;
  }

  async markOrderPaid(paymentIntentId: string) {
    return this.orderModel.findOneAndUpdate(
      { paymentIntentId },
      { status: 'paid' },
      { new: true },
    );
  }

  async getOrderStatus(orderId: string) {
    const order = await this.orderModel.findById(orderId).select('status');
    if (!order) {
      throw new Error('Order not found');
    }
    return { orderId, status: order.status };
  }

  async getUserOrders(userId: string) {
    return this.orderModel
      .find({ userId })
      .populate('items.productId') // ✅ auto populate product details
      .sort({ createdAt: -1 }); // newest first
  }

  async getAllOrders() {
    return this.orderModel
      .find()
      .populate('items.productId')
      .sort({ createdAt: -1 });
  }
}

// src/orders/orders.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string): Promise<Order> {
    // get user cart
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new ForbiddenException('Cart is empty');
    }

    // calculate total
    let total = 0;
    cart.items.forEach((item) => {
      if (item && item.product) {
        total += item.product.price * item.quantity; // product is populated
      }
    });

    // create order
    const order = new this.orderModel({
      userId,
      items: cart.items
        .filter((i) => i && i.product)
        .map((i) => ({
          productId: i!.product.id,
          quantity: i!.quantity,
        })),
      total,
      status: 'pending',
    });
    await order.save();

    // clear cart after checkout
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
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }
    return updatedOrder;
  }
}

// cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      cart = await this.cartModel.create({ userId, items: [] });
    }

    // Populate product details
    const detailedItems = await Promise.all(
      cart.items.map(async (i) => {
        const product = await this.productModel.findById(i.productId).lean();
        if (!product) {
          return null; // handle deleted products gracefully
        }
        return {
          product: {
            id: product._id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            images: product.images,
          },
          quantity: i.quantity,
        };
      }),
    );

    return {
      userId: cart.userId,
      items: detailedItems.filter(Boolean), // remove nulls
    };
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);
    const existing = await this.cartModel.findOne({ userId });
    if (!existing) {
      throw new NotFoundException('Cart not found');
    }
    const item = existing.items.find((i) => i.productId === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      existing.items.push({ productId, quantity });
    }
    await existing.save();
    return this.getCart(userId); // return populated
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const item = cart.items.find((i) => i.productId === productId);
    if (!item) throw new NotFoundException('Item not in cart');
    item.quantity = quantity;
    await cart.save();
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    cart.items = cart.items.filter((i) => i.productId !== productId);
    await cart.save();
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    cart.items = [];
    await cart.save();
    return this.getCart(userId);
  }
}

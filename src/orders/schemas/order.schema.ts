// src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],
  })
  items: { productId: string; quantity: number }[];

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'pending' })
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

  @Prop({
    required: true,
  })
  userEmail: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

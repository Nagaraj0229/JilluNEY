// cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ required: true })
  userId: string; // Firebase UID

  @Prop([
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ])
  items: { productId: string; quantity: number }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

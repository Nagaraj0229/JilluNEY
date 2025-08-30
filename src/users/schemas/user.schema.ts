import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  // Firebase UID as primary key field (not _id)
  @Prop({ required: true, unique: true, index: true })
  uid: string;

  @Prop({ index: true })
  email?: string;

  @Prop()
  displayName?: string;

  @Prop()
  photoURL?: string;

  @Prop({ default: 'customer', index: true })
  role: 'customer' | 'admin';
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

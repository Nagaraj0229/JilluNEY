// cart.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule, // 👈 import so @InjectModel(Product.name) works
    UsersModule,
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}

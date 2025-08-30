// products.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UsersModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [MongooseModule], // 👈 export so other modules can inject ProductModel
})
export class ProductsModule {}

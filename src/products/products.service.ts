import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(filter: any = {}) {
    return this.productModel.find(filter).lean();
  }

  async findById(id: string) {
    const prod = await this.productModel.findById(id).lean();
    if (!prod) throw new NotFoundException('Product not found');
    return prod;
  }

  async create(dto: Partial<Product>) {
    const prod = new this.productModel(dto);
    return prod.save();
  }

  async update(id: string, dto: Partial<Product>) {
    const prod = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!prod) throw new NotFoundException('Product not found');
    return prod;
  }

  async remove(id: string) {
    const prod = await this.productModel.findByIdAndDelete(id).lean();
    if (!prod) throw new NotFoundException('Product not found');
    return { deleted: true };
  }
}

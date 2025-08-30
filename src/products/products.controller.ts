import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { AuthRole } from '../auth/roles.decorator';
import { UsersService } from '../users/users.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly products: ProductsService,
    private readonly users: UsersService,
  ) {}

  // Public
  @Get()
  async findAll() {
    return this.products.findAll({ active: true });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.products.findById(id);
  }

  // Admin only
  @Post()
  @AuthRole('admin')
  async create(@Body() dto: CreateProductDto, @Req() req: any) {
    // ensure userDoc is attached
    if (!req.userDoc) {
      req.userDoc = await this.users.upsertFromFirebaseToken(req.user);
    }
    return this.products.create(dto);
  }

  @Patch(':id')
  @AuthRole('admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    if (!req.userDoc) {
      req.userDoc = await this.users.upsertFromFirebaseToken(req.user);
    }
    return this.products.update(id, dto);
  }

  @Delete(':id')
  @AuthRole('admin')
  async remove(@Param('id') id: string, @Req() req: any) {
    if (!req.userDoc) {
      req.userDoc = await this.users.upsertFromFirebaseToken(req.user);
    }
    return this.products.remove(id);
  }
}

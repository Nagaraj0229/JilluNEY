// src/orders/orders.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
@UseGuards(FirebaseAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Req() req) {
    return this.ordersService.createOrder(req.user.uid);
  }

  @Get()
  async getMyOrders(@Req() req) {
    return this.ordersService.getOrders(req.user.uid);
  }

  @Get(':id')
  async getOrder(@Req() req, @Param('id') id: string) {
    return this.ordersService.getOrderById(req.user.uid, id);
  }

  @Patch(':id/status')
  @UseGuards(new RolesGuard(['admin']))
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}

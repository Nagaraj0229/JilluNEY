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

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async createOrder(@Req() req, @Body() body: { paymentMethod: string }) {
    return this.ordersService.createOrder(
      req.user.uid,
      req.user.email,
      body.paymentMethod || 'cod',
    );
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

  @UseGuards(FirebaseAuthGuard)
  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    return this.ordersService.getOrderStatus(id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async listOrders(@Req() req) {
    return this.ordersService.getUserOrders(req.user.uid);
  }

  @UseGuards(FirebaseAuthGuard, new RolesGuard(['admin']))
  @Get('all')
  async listAllOrders() {
    return this.ordersService.getAllOrders();
  }
}

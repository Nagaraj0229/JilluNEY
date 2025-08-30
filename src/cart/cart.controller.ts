// cart.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('cart')
@UseGuards(FirebaseAuthGuard) // 🔒 all cart endpoints require login
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.userDoc.uid);
  }

  @Post('add')
  addItem(
    @Req() req: any,
    @Body() body: { productId: string; quantity: number },
  ) {
    return this.cartService.addItem(
      req.userDoc.uid,
      body.productId,
      body.quantity,
    );
  }

  @Patch('update/:productId')
  updateItem(
    @Req() req: any,
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItem(
      req.userDoc.uid,
      productId,
      body.quantity,
    );
  }

  @Delete('remove/:productId')
  removeItem(@Req() req: any, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.userDoc.uid, productId);
  }

  @Delete('clear')
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.userDoc.uid);
  }
}

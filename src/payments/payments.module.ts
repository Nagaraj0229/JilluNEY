// src/payments/payments.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)], // ✅ handle circular dep
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService], // ✅ export service if other modules need it
})
export class PaymentsModule {}

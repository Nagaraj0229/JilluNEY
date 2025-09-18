import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseAdminProvider } from './common/firebase/firebase.provider';
import { HealthModule } from './health/health.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { MailerModule } from './mail/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('MONGODB_URI')!,
        dbName: undefined, // included in URI
      }),
    }),
    UsersModule,
    AuthModule,
    HealthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    MailerModule,
  ],
  controllers: [HealthController],
  providers: [FirebaseAdminProvider],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ capture raw body for Stripe webhook
  app.use('/payments/webhook', bodyParser.raw({ type: 'application/json' }));

  // Simple CORS for local dev
  const origin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  app.enableCors({ origin, credentials: true });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
}
bootstrap();

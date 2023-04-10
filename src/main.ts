import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { corsOptions } from './common/config/cors.config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/errors/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(urlencoded({ extended: false }));
  app.use(json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();

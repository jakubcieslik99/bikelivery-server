import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cors from './config/app/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = app.get(ConfigService);

  const host = config.get('app.host') === 'localhost' ? '127.0.0.1' : config.get('app.host');
  app.getHttpAdapter().getInstance().set('trust proxy', `loopback, ${host}`);

  app.use(helmet());
  app.enableCors(cors(config));

  await app.listen(config.get('app.port'));
}
bootstrap();

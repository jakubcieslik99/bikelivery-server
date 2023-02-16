import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/config/env.validation';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate })],
  controllers: [],
  providers: [],
})
export class AppModule {}

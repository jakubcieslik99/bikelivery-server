import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from './common/config/env.validation';
import { dbConfig } from './common/config/db.config';
import { GoogleMapsModule } from './google-maps/google-maps.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate }), TypeOrmModule.forRootAsync(dbConfig), GoogleMapsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

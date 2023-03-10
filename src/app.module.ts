import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { validate } from './common/config/env.validation';
import { dbConfig } from './common/config/db.config';
import { throttlerConfig, throttlerServiceConfig } from './common/config/throttler.config';
import { TripsModule } from './trips/trips.module';
import { StatsModule } from './stats/stats.module';
import { GoogleMapsModule } from './google-maps/google-maps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    TypeOrmModule.forRootAsync(dbConfig),
    ThrottlerModule.forRoot(throttlerConfig),
    TripsModule,
    StatsModule,
    GoogleMapsModule,
  ],
  controllers: [],
  providers: [throttlerServiceConfig],
})
export class AppModule {}

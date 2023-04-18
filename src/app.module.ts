import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { validate } from './utils/validation/env.validation';
import { throttlerConfig, throttlerServiceConfig } from './utils/config/throttler.config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TripsModule } from './trips/trips.module';
import { StatsModule } from './stats/stats.module';
import { GoogleMapsModule } from './google-maps/google-maps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    ThrottlerModule.forRoot(throttlerConfig),
    PrismaModule,
    AuthModule,
    TripsModule,
    StatsModule,
    GoogleMapsModule,
  ],
  controllers: [],
  providers: [throttlerServiceConfig],
})
export class AppModule {}

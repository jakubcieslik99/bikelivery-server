import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app/app.config';
import cacheConfig from './config/cache/cache.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/typeorm.config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { TripsModule } from './trips/trips.module';
import { UsersModule } from './users/users.module';
import { StatsModule } from './stats/stats.module';
import { GoogleMapsModule } from './google-maps/google-maps.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import cookieSession from 'cookie-session';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        throttlers: configService.get('throttlers'),
      }),
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, cacheConfig],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    RedisModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          type: 'single',
          url: `redis://${configService.get('cache.host')}:${configService.get('cache.port')}`,
          options: { password: configService.get('cache.password'), db: 0 },
        }),
      },
      'sessions',
    ),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: async () =>
          redisStore({
            ttl: configService.get('cache.ttl'),
            host: configService.get('cache.host'),
            port: configService.get('cache.port'),
            password: configService.get('cache.password'),
            db: 1,
          }),
      }),
    }),
    JwtModule.register({ global: true }),
    AuthModule,
    TripsModule,
    UsersModule,
    StatsModule,
    GoogleMapsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession(this.configService.get('cookieSession'))).forRoutes('*');
  }
}

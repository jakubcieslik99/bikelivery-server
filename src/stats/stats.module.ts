import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { JWTAuthStrategy } from 'src/auth/jwt-auth.strategy';

@Module({
  controllers: [StatsController],
  providers: [StatsService, JWTAuthStrategy],
  imports: [],
})
export class StatsModule {}

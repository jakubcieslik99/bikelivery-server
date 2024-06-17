import { Controller, UseGuards, HttpCode, UseInterceptors, Get, Query } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { StatsService } from './stats.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserInfoDto } from '../users/dtos/user.dto';
import { GetMonthlyStatsDto } from './dtos/get-monthly-stats.dto';

@Controller('/stats')
@UseGuards(AuthGuard)
@UseInterceptors(CacheInterceptor)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/weekly')
  @HttpCode(200)
  async getWeeklyStats(@CurrentUser() userInfo: UserInfoDto) {
    return await this.statsService.getWeeklyStats(userInfo.id);
  }

  @Get('/monthly')
  @HttpCode(200)
  async getMonthlyStats(@CurrentUser() userInfo: UserInfoDto, @Query() query: GetMonthlyStatsDto) {
    return await this.statsService.getMonthlyStats(userInfo.id, query.sort);
  }
}

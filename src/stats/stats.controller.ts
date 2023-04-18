import { Controller, UseGuards, HttpCode, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUserInfo } from 'src/utils/decorators/user-info.decorator';
import UserInfo from 'src/utils/interfaces/user-info.interface';

@Controller('/api/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JWTAuthGuard)
  @Get('/weekly')
  @HttpCode(200)
  async getWeeklyStats(@GetUserInfo() userInfo: UserInfo) {
    return await this.statsService.getWeeklyStats(userInfo);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/monthly')
  @HttpCode(200)
  async getMonthlyStats(@GetUserInfo() userInfo: UserInfo, @Query('sort') sort: string) {
    return await this.statsService.getMonthlyStats(userInfo, sort);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('/api/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/weekly')
  async getWeeklyStats() {
    return await this.statsService.getWeeklyStats();
  }

  @Get('/monthly')
  async getMonthlyStats(@Query('sort') sort: string) {
    return await this.statsService.getMonthlyStats(sort);
  }
}

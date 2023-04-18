import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import UserInfo from 'src/utils/interfaces/user-info.interface';
import WeeklyStats from 'src/utils/interfaces/weekly-stats.interface';
import MonthlyStats from 'src/utils/interfaces/monthly-stats.interface';

@Injectable()
export class StatsService {
  constructor(private db: PrismaService) {}

  //GET /stats/weekly
  async getWeeklyStats(userInfo: UserInfo): Promise<WeeklyStats> {
    const stats: WeeklyStats[] | [] = await this.db.$queryRaw`
      SELECT
        ROUND(SUM(CAST(trips.distance AS numeric))/1000, 2) || 'km' AS total_distance,
        ROUND(SUM(CAST(trips.price AS numeric)), 2) || 'PLN' AS total_price
      FROM trips
      WHERE trips.user_id = ${userInfo.id}
      AND EXTRACT('year' FROM trips.date) || '-' || EXTRACT('week' FROM trips.date) = EXTRACT('year' FROM NOW()) || '-' || EXTRACT('week' FROM NOW())
    `;

    return stats[0] || { total_distance: '0km', total_price: '0PLN' };
  }

  //GET /stats/monthly
  async getMonthlyStats(userInfo: UserInfo, sort: string): Promise<MonthlyStats[] | []> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let stats: MonthlyStats[] | [] = [];
    if (!sort || sort === 'newest') {
      stats = await this.db.$queryRaw`
        SELECT
          to_char(trips.date, 'Month, DDth') AS day,
          ROUND(SUM(trips.distance::numeric)/1000, 2) || 'km' AS total_distance,
          ROUND(AVG(trips.distance::numeric)/1000, 2) || 'km' AS avg_ride,
          ROUND(AVG(trips.price::numeric), 2) || 'PLN' AS avg_price
        FROM trips
        WHERE trips.date >= ${startDate} AND trips.date <= ${endDate}
        AND trips.user_id = ${userInfo.id}
        GROUP BY day
        ORDER BY day DESC
      `;
    } else if (sort === 'oldest') {
      stats = await this.db.$queryRaw`
        SELECT
          to_char(trips.date, 'Month, DDth') AS day,
          ROUND(SUM(trips.distance::numeric)/1000, 2) || 'km' AS total_distance,
          ROUND(AVG(trips.distance::numeric)/1000, 2) || 'km' AS avg_ride,
          ROUND(AVG(trips.price::numeric), 2) || 'PLN' AS avg_price
        FROM trips
        WHERE trips.date >= ${startDate} AND trips.date <= ${endDate}
        AND trips.user_id = ${userInfo.id}
        GROUP BY day
        ORDER BY day ASC
      `;
    } else throw new NotAcceptableException('Invalid sort value');

    return stats;
  }
}

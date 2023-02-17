import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../trips/entity/trip.entity';

@Injectable()
export class StatsService {
  constructor(@InjectRepository(Trip) private tripRepository: Repository<Trip>) {}

  //GET /stats/weekly
  async getWeeklyStats(): Promise<{ total_distance: string; total_price: string }> {
    const stats = await this.tripRepository
      .createQueryBuilder('trip')
      .select("ROUND(SUM(trip.distance::numeric)/1000, 2) || 'km'", 'total_distance')
      .addSelect("ROUND(SUM(trip.price::numeric), 2) || 'PLN'", 'total_price')
      .where(
        "EXTRACT('year' FROM trip.date) || '-' || EXTRACT('week' FROM trip.date) = EXTRACT('year' FROM NOW()) || '-' || EXTRACT('week' FROM NOW())",
      )
      .getRawOne();

    return stats;
  }

  //GET /stats/monthly
  async getMonthlyStats(
    sort: string,
  ): Promise<{ day: string; total_distance: string; avg_ride: string; avg_price: string }[] | []> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const stats = await this.tripRepository
      .createQueryBuilder('trip')
      .select("to_char(trip.date, 'MonthDDth')", 'day')
      .addSelect("ROUND(SUM(trip.distance::numeric)/1000, 2) || 'km'", 'total_distance')
      .addSelect("ROUND(AVG(trip.distance::numeric)/1000, 2) || 'km'", 'avg_ride')
      .addSelect("ROUND(AVG(trip.price::numeric), 2) || 'PLN'", 'avg_price')
      .where('trip.date >= :startDate', { startDate })
      .andWhere('trip.date <= :endDate', { endDate })
      .groupBy('day')
      .orderBy('day', sort === 'newest' ? 'DESC' : 'ASC')
      .getRawMany();

    return stats;
  }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from '../trips/entities/trip.entity';
import { GetMonthlyStatsSortEnum } from './dtos/get-monthly-stats.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  getStartOfCurrentWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const startOfWeek = new Date(now.setDate(now.getDate() + diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  getEndOfCurrentWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const startOfWeek = new Date(now.setDate(now.getDate() + diff));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  getStartOfCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  getEndOfCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  async getWeeklyStats(userId: number) {
    const startOfWeek = this.getStartOfCurrentWeek();
    const endOfWeek = this.getEndOfCurrentWeek();

    const weeklyStats = await this.tripsRepository
      .createQueryBuilder('trip')
      .select("ROUND(SUM(trip.distance::numeric)/1000, 2) || 'km'", 'totalDistance')
      .addSelect("ROUND(SUM(trip.price::numeric), 2) || ' PLN'", 'totalPrice')
      .where('trip.userId = :userId', { userId })
      .andWhere('trip.date >= :startOfWeek AND trip.date <= :endOfWeek', { startOfWeek, endOfWeek })
      .getRawOne();

    const interval = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;

    return { ...weeklyStats, interval };
  }

  async getMonthlyStats(userId: number, sort: GetMonthlyStatsSortEnum) {
    const sortKey = Object.keys(GetMonthlyStatsSortEnum).find(key => GetMonthlyStatsSortEnum[key] === sort);

    const startOfMonth = this.getStartOfCurrentMonth();
    const endOfMonth = this.getEndOfCurrentMonth();

    const monthlyStats = await this.tripsRepository
      .createQueryBuilder('trip')
      .select("to_char(trip.date, 'Month, DDth')", 'day')
      .addSelect("ROUND(SUM(trip.distance::numeric)/1000, 2) || 'km'", 'totalDistance')
      .addSelect("ROUND(AVG(trip.distance::numeric)/1000, 2) || 'km'", 'avgRide')
      .addSelect("ROUND(AVG(trip.price::numeric), 2) || ' PLN'", 'avgPrice')
      .where('trip.userId = :userId', { userId })
      .andWhere('trip.date >= :startOfMonth AND trip.date <= :endOfMonth', { startOfMonth, endOfMonth })
      .groupBy('day')
      .orderBy('day', sortKey as keyof typeof GetMonthlyStatsSortEnum)
      .getRawMany();

    const interval = `${startOfMonth.toLocaleDateString()} - ${endOfMonth.toLocaleDateString()}`;

    monthlyStats.forEach(stat => (stat.day = stat.day.replace(/ {5}/, '')));

    return { monthlyStats, interval };
  }
}

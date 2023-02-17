import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entity/trip.entity';
import { GoogleMapsModule } from '../google-maps/google-maps.module';

@Module({
  controllers: [],
  providers: [],
  imports: [TypeOrmModule.forFeature([Trip]), GoogleMapsModule],
})
export class TripsModule {}

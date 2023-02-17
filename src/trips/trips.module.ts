import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from './entity/trip.entity';
import { GoogleMapsModule } from '../google-maps/google-maps.module';

@Module({
  controllers: [TripsController],
  providers: [TripsService],
  imports: [TypeOrmModule.forFeature([Trip]), GoogleMapsModule],
})
export class TripsModule {}

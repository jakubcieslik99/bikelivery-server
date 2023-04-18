import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { GoogleMapsModule } from '../google-maps/google-maps.module';
import { JWTAuthStrategy } from 'src/auth/jwt-auth.strategy';

@Module({
  controllers: [TripsController],
  providers: [TripsService, JWTAuthStrategy],
  imports: [GoogleMapsModule],
})
export class TripsModule {}

import { Module } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';

@Module({
  providers: [GoogleMapsService],
})
export class GoogleMapsModule {}

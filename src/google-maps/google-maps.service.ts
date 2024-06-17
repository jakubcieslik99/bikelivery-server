import { Injectable } from '@nestjs/common';
import { Client, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleMapsService extends Client {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async getDirections(startAddress: string, destinationAddress: string) {
    const directions = await this.directions({
      params: {
        origin: startAddress,
        destination: destinationAddress,
        mode: TravelMode.bicycling,
        units: UnitSystem.metric,
        key: this.configService.get('googleDirections.apiKey'),
      },
    });

    return directions.data.routes[0].legs[0];
  }
}

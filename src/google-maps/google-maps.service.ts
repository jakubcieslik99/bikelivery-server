import { Client, RouteLeg } from '@googlemaps/google-maps-services-js';
import { TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js/dist/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Injectable()
export class GoogleMapsService extends Client {
  /*constructor() {
    super();
  }*/

  async getDirections(start_address: string, destination_address: string): Promise<RouteLeg> {
    const directions = await this.directions({
      params: {
        origin: start_address,
        destination: destination_address,
        mode: TravelMode.bicycling,
        units: UnitSystem.metric,
        key: configService.get<string>('GOOGLE_DIRECTIONS_API_KEY'),
      },
    }).catch(error => {
      throw new Error(error.response.data.error_message);
    });

    return directions.data.routes[0].legs[0];
  }
}

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RouteLeg } from '@googlemaps/google-maps-services-js/dist/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleMapsService } from 'src/google-maps/google-maps.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import UserInfo from 'src/utils/interfaces/user-info.interface';
import Trip from 'src/utils/interfaces/trip.interface';

@Injectable()
export class TripsService {
  constructor(private db: PrismaService, private readonly googleMapsService: GoogleMapsService) {}

  //GET /trips
  async getTrips(userInfo: UserInfo): Promise<Trip[] | []> {
    const trips: Trip[] | [] = await this.db.$queryRaw`
      SELECT
        trips.id,
        trips.start_address,
        trips.destination_address,
        to_char(trips.date, 'YYYY-MM-DD') AS date,
        ROUND(trips.distance::numeric/1000, 2) || 'km' AS distance,
        ROUND(trips.price::numeric, 2) || 'PLN' AS price
      FROM trips
      WHERE trips.user_id = ${userInfo.id}
    `;

    return trips;
  }

  //POST /trips
  async createTrip(userInfo: UserInfo, createTripDto: CreateTripDto): Promise<{ message: string; trip: Trip }> {
    const directions = await this.googleMapsService.getDirections(
      createTripDto.start_address,
      createTripDto.destination_address,
    );

    const newTrip = {
      ...createTripDto,
      distance: directions.distance.value,
      price: Number(createTripDto.price),
      date: new Date(createTripDto.date),
      user_id: userInfo.id,
    };
    const trip = await this.db.trip.create({ data: newTrip });

    return {
      message: 'Trip added successfully.',
      trip: {
        ...trip,
        distance: `${(trip.distance / 1000).toFixed(2)}km`,
        price: `${createTripDto.price}PLN`,
        date: createTripDto.date,
      },
    };
  }

  //PUT /trips/:id
  async updateTrip(userInfo: UserInfo, id: string, updateTripDto: UpdateTripDto): Promise<{ message: string; trip: Trip }> {
    const existingTrip = await this.db.trip.findUnique({ where: { id } });
    if (!existingTrip) throw new NotFoundException('Trip not found.');

    if (existingTrip.user_id !== userInfo.id) throw new ForbiddenException('Not allowed to update this trip.');

    let directions: RouteLeg | null = null;
    if (
      updateTripDto.start_address !== existingTrip.start_address ||
      updateTripDto.destination_address !== existingTrip.destination_address
    ) {
      directions = await this.googleMapsService.getDirections(
        updateTripDto.start_address,
        updateTripDto.destination_address,
      );
    }

    const updatedTrip = {
      ...existingTrip,
      ...updateTripDto,
      distance: directions?.distance.value || existingTrip.distance,
      price: Number(updateTripDto.price),
      date: new Date(updateTripDto.date),
    };
    const trip = await this.db.trip.update({ where: { id }, data: updatedTrip });

    return {
      message: 'Trip updated successfully.',
      trip: {
        ...trip,
        distance: `${(trip.distance / 1000).toFixed(2)}km`,
        price: `${updateTripDto.price}PLN`,
        date: updateTripDto.date,
      },
    };
  }

  //DELETE /trips/:id
  async deleteTrip(userInfo: UserInfo, id: string): Promise<{ message: string }> {
    const existingTrip = await this.db.trip.findUnique({ where: { id } });
    if (!existingTrip) throw new NotFoundException('Trip not found.');

    if (existingTrip.user_id !== userInfo.id) throw new ForbiddenException('Not allowed to delete this trip.');

    await this.db.trip.delete({ where: { id } });

    return { message: 'Trip deleted successfully.' };
  }
}

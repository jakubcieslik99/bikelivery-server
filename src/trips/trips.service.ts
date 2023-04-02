import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteLeg } from '@googlemaps/google-maps-services-js/dist/common';
import { Trip } from './entity/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { GoogleMapsService } from 'src/google-maps/google-maps.service';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private tripRepository: Repository<Trip>,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  //GET /trips
  async getTrips(): Promise<any[]> {
    const trips = await this.tripRepository
      .createQueryBuilder('trip')
      .select('trip.id, trip.start_address, trip.destination_address')
      .addSelect("to_char(trip.date, 'YYYY-MM-DD')", 'date')
      .addSelect("ROUND(trip.distance::numeric/1000, 2) || 'km'", 'distance')
      .addSelect("ROUND(trip.price::numeric, 2) || 'PLN'", 'price')
      .getRawMany();

    return trips;
  }

  //POST /trips
  async createTrip(createTripDto: CreateTripDto): Promise<{ message: string; trip: Trip }> {
    const directions = await this.googleMapsService.getDirections(
      createTripDto.start_address,
      createTripDto.destination_address,
    );

    const newTrip = {
      ...createTripDto,
      date: new Date(createTripDto.date),
      distance: directions.distance.value,
    };
    const trip = await this.tripRepository.save(newTrip);

    return { message: 'Trip added successfully.', trip };
  }

  //PUT /trips/:id
  async updateTrip(id: string, updateTripDto: UpdateTripDto): Promise<{ message: string; trip: Trip }> {
    const existingTrip = await this.tripRepository.findOneBy({ id });
    if (!existingTrip) throw new NotFoundException('Trip not found.');

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
      date: new Date(updateTripDto.date),
      distance: directions?.distance.value || existingTrip.distance,
    };
    const trip = await this.tripRepository.save(updatedTrip);

    return { message: 'Trip updated successfully.', trip };
  }

  //DELETE /trips/:id
  async deleteTrip(id: string): Promise<{ message: string }> {
    const existingTrip = await this.tripRepository.findOneBy({ id });
    if (!existingTrip) throw new NotFoundException('Trip not found.');

    await this.tripRepository.delete({ id });

    return { message: 'Trip deleted successfully.' };
  }
}

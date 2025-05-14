import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTripDto } from './dtos/create-trip.dto';
import { UpdateTripDto } from './dtos/update-trip.dto';
import { Trip } from './entities/trip.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  async getTrips(userId: number) {
    return this.tripsRepository.find({ where: { user: { id: userId } }, order: { date: 'DESC' } });
    // return this.tripsRepository.find({ where: { user: { id: userId } }, order: { date: 'DESC' }, relations: ['user'] });
  }

  async createTrip(trip: CreateTripDto, userId: number, distance: number) {
    const newTrip = this.tripsRepository.create({
      ...trip,
      distance,
      price: trip.price,
      date: new Date(trip.date),
      user: { id: userId },
    });
    await this.tripsRepository.save(newTrip);

    return newTrip;
  }

  async updateTrip(id: number, trip: UpdateTripDto, userId: number, distance: number) {
    const existingTrip = await this.tripsRepository.findOne({ where: { id } });
    if (!existingTrip) {
      throw new NotFoundException('Trip not found');
    }

    if (existingTrip.userId !== userId) {
      throw new ConflictException('You are not the owner of this trip');
    }

    const updatedTrip = await this.tripsRepository.save({
      ...existingTrip,
      ...trip,
      distance,
      price: trip.price,
      date: new Date(trip.date),
    });

    return updatedTrip;
  }

  async deleteTrip(id: number, userId: number) {
    const existingTrip = await this.tripsRepository.findOne({ where: { id } });
    if (!existingTrip) {
      throw new NotFoundException('Trip not found');
    }

    if (existingTrip.userId !== userId) {
      throw new ConflictException('You are not the owner of this trip');
    }

    await this.tripsRepository.remove(existingTrip);
  }
}

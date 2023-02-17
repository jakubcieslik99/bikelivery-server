import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { Body, Param, Get, Post, Put, Delete } from '@nestjs/common/decorators';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripsService } from './trips.service';

@Controller('/api/trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  async getTrips() {
    return await this.tripsService.getTrips();
  }

  @Post()
  async createTrip(@Body() createTripDto: CreateTripDto) {
    return await this.tripsService.createTrip(createTripDto);
  }

  @Put('/:id')
  async updateTrip(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateTripDto: UpdateTripDto) {
    return await this.tripsService.updateTrip(id, updateTripDto);
  }

  @Delete('/:id')
  async deleteTrip(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.tripsService.deleteTrip(id);
  }
}

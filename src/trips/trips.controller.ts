import { Controller, UseGuards, HttpCode, UseInterceptors } from '@nestjs/common';
import { Get, Post, Put, Delete, Body, Param } from '@nestjs/common/decorators';
import { AuthGuard } from '../common/guards/auth.guard';
import { TripsService } from './trips.service';
import { GoogleMapsService } from '../google-maps/google-maps.service';
import { Serialize } from '../common/decorators/serialize.decorator';
import { TripDto } from './dtos/trip.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CreateTripDto, CreateTripResDto } from './dtos/create-trip.dto';
import { UpdateTripDto, UpdateTripResDto } from './dtos/update-trip.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserInfoDto } from '../users/dtos/user.dto';

@Controller('/trips')
@UseGuards(AuthGuard)
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  @Get()
  @HttpCode(200)
  @CacheTTL(1)
  @Serialize(TripDto)
  @UseInterceptors(CacheInterceptor)
  async getTrips(@CurrentUser() userInfo: UserInfoDto) {
    return await this.tripsService.getTrips(userInfo.id);
  }

  @Post()
  @HttpCode(201)
  @Serialize(CreateTripResDto)
  async createTrip(@Body() createTripDto: CreateTripDto, @CurrentUser() userInfo: UserInfoDto) {
    const { distance } = await this.googleMapsService.getDirections(
      createTripDto.start_address,
      createTripDto.destination_address,
    );

    const trip = await this.tripsService.createTrip(createTripDto, userInfo.id, distance.value);
    return { message: ['Trip added successfully.'], trip };
  }

  @Put('/:id')
  @HttpCode(200)
  @Serialize(UpdateTripResDto)
  async updateTrip(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto, @CurrentUser() userInfo: UserInfoDto) {
    const { distance } = await this.googleMapsService.getDirections(
      updateTripDto.start_address,
      updateTripDto.destination_address,
    );

    const trip = await this.tripsService.updateTrip(+id, updateTripDto, userInfo.id, distance.value);
    return { message: ['Trip updated successfully.'], trip };
  }

  @Delete('/:id')
  @HttpCode(200)
  async deleteTrip(@Param('id') id: string, @CurrentUser() userInfo: UserInfoDto) {
    await this.tripsService.deleteTrip(+id, userInfo.id);
    return { message: ['Trip deleted successfully.'] };
  }
}

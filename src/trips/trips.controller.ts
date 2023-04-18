import { Controller, UseGuards, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { Body, Param, Get, Post, Put, Delete } from '@nestjs/common/decorators';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripsService } from './trips.service';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUserInfo } from 'src/utils/decorators/user-info.decorator';
import UserInfo from 'src/utils/interfaces/user-info.interface';

@Controller('/api/trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @UseGuards(JWTAuthGuard)
  @Get()
  @HttpCode(200)
  async getTrips(@GetUserInfo() userInfo: UserInfo) {
    return await this.tripsService.getTrips(userInfo);
  }

  @UseGuards(JWTAuthGuard)
  @Post()
  @HttpCode(201)
  async createTrip(@GetUserInfo() userInfo: UserInfo, @Body() createTripDto: CreateTripDto) {
    return await this.tripsService.createTrip(userInfo, createTripDto);
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id')
  @HttpCode(200)
  async updateTrip(
    @GetUserInfo() userInfo: UserInfo,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return await this.tripsService.updateTrip(userInfo, id, updateTripDto);
  }

  @UseGuards(JWTAuthGuard)
  @Delete('/:id')
  @HttpCode(200)
  async deleteTrip(@GetUserInfo() userInfo: UserInfo, @Param('id', new ParseUUIDPipe()) id: string) {
    return await this.tripsService.deleteTrip(userInfo, id);
  }
}

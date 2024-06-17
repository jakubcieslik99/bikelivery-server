import { Expose, Exclude, Type, Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from '../../users/dtos/user.dto';

export class TripDto {
  @Expose()
  id: number;

  @Expose()
  start_address: string;

  @Expose()
  destination_address: string;

  @Expose()
  date: Date;

  @Expose()
  @Transform(({ obj }) => `${(obj.distance / 1000).toFixed(2)}km`)
  distance: string;

  @Expose()
  @Transform(({ obj }) => `${parseFloat(obj.price).toFixed(2)} PLN`)
  price: string;

  @Expose()
  userId: number;
}

export class TripUserDto extends PartialType(TripDto) {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Exclude()
  userId: number;
}

import { IsString, MinLength, IsDateString, IsNotEmpty, IsCurrency, Matches } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { TripDto } from './trip.dto';

export class CreateTripDto {
  @IsNotEmpty({ message: 'Start address is required.' })
  @IsString({ message: 'Start address is not a string.' })
  @MinLength(3, { message: 'Start address is too short.' })
  start_address: string;

  @IsNotEmpty({ message: 'Destination address is required.' })
  @IsString({ message: 'Destination address is not a string.' })
  @MinLength(3, { message: 'Destination address is too short.' })
  destination_address: string;

  @IsNotEmpty({ message: 'Price is required.' })
  @IsCurrency({}, { message: 'Invalid price format.' })
  @Matches(/^(\d{1,4}\.\d{2})?$/, { message: 'Price must be greater than 0.00 and less than 10000.00.' })
  price: number;

  @IsNotEmpty({ message: 'Date is required.' })
  @IsDateString({}, { message: 'Invalid date format.' })
  date: string;
}

export class CreateTripResDto {
  @Expose()
  message: string[];

  @Expose()
  @Type(() => TripDto)
  trip: TripDto;
}

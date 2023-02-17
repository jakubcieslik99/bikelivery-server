import { IsString, IsNumber, MinLength, Min, Max, IsDateString, IsNotEmpty } from 'class-validator';

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
  @IsNumber({}, { message: 'Price is not a number.' })
  @Min(1, { message: 'Price is too low.' })
  @Max(9999, { message: 'Price is too high.' })
  price: number;
  @IsNotEmpty({ message: 'Date is required.' })
  @IsDateString({}, { message: 'Invalid date format.' })
  date: string;
}

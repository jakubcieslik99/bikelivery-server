import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto, CreateTripResDto } from './create-trip.dto';

export class UpdateTripDto extends PartialType(CreateTripDto) {}

export class UpdateTripResDto extends PartialType(CreateTripResDto) {}

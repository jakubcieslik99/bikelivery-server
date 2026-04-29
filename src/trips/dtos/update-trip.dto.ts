//import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto, CreateTripResDto } from './create-trip.dto';

export class UpdateTripDto extends CreateTripDto {}
//export class UpdateTripDto extends PartialType(CreateTripDto) {}

export class UpdateTripResDto extends CreateTripResDto {}
//export class UpdateTripResDto extends PartialType(CreateTripResDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto, RegisterResDto } from './register.dto';

export class LoginDto extends PartialType(RegisterDto) {}

export class LoginResDto extends PartialType(RegisterResDto) {}

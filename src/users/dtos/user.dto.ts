import { Expose } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}

export class UserInfoDto extends PartialType(UserDto) {}

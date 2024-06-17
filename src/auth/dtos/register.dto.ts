import { IsEmail, IsString, MinLength, IsNotEmpty, MaxLength } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { UserInfoDto } from '../../users/dtos/user.dto';

export class RegisterDto {
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsString({ message: 'Email is not a string.' })
  @MaxLength(60, { message: 'Email cannot be longer than 60 characters.' })
  @IsEmail({}, { message: 'Email is not valid.' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @IsString({ message: 'Password is not a string.' })
  @MinLength(3, { message: 'Password must be between 8 and 60 characters long.' })
  @MaxLength(60, { message: 'Password must be between 8 and 60 characters long.' })
  password: string;
}

export class RegisterResDto {
  @Expose()
  message: string[];

  @Expose()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @Expose()
  accessToken: string;
}

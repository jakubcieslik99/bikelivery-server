import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserInfoDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  prepareUserInfo(user: User) {
    return {
      id: user.id,
      email: user.email,
    } as UserInfoDto;
  }
}

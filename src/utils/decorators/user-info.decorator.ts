import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import UserInfo from '../interfaces/user-info.interface';

export const GetUserInfo = createParamDecorator((_: undefined, context: ExecutionContext): UserInfo => {
  const request = context.switchToHttp().getRequest();
  return request.user as UserInfo;
});

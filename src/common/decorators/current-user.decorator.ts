import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfoDto } from '../../users/dtos/user.dto';

export const CurrentUser = createParamDecorator((_data: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  return request.userInfo as UserInfoDto;
});

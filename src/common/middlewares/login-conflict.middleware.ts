import { Injectable, NestMiddleware, ConflictException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { UserInfoDto } from '../../users/dtos/user.dto';
import { Request as ExpressRequest, Response, NextFunction } from 'express';

type Request = ExpressRequest & { userInfo?: UserInfoDto };

@Injectable()
export class LoginConflictMiddleware implements NestMiddleware {
  constructor(
    @InjectRedis('sessions')
    private readonly redis: Redis,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    if (req.session?.refreshToken || req.userInfo) {
      req.session.refreshToken = undefined;

      if (req.userInfo) {
        const userId = req.userInfo.id.toString();
        await Promise.all([this.redis.del(userId), (req.userInfo = undefined)]);
      }

      throw new ConflictException('Another user logged in. Logging out...');
    }
    next();
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshAccessTokenGuard implements CanActivate {
  constructor(
    @InjectRedis('sessions')
    private readonly redis: Redis,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();

      const { refreshToken } = request.session || {};
      if (!refreshToken) throw new UnauthorizedException('Unauthorized.');

      const { userId } = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('jwt.refreshToken.secret'),
      });

      const userInfo = await this.redis.get(userId.toString());
      if (!userInfo) throw new UnauthorizedException('Unauthorized.');

      request.userInfo = JSON.parse(userInfo);

      return true;
    } catch (error) {
      const request = context.switchToHttp().getRequest();
      request.session = null;

      if (error instanceof HttpException) {
        throw new HttpException({ message: error.message }, error.getStatus());
      }
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Session expired. Please log in again.');
      }
      throw new Error(error.message || 'Unknown error occurred.');
    }
  }
}

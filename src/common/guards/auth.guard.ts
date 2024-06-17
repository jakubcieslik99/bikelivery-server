import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRedis('sessions')
    private readonly redis: Redis,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();

      const bearerToken = request.headers.authorization;
      if (!bearerToken) throw new UnauthorizedException('Unauthorized.');

      const token = bearerToken.split(' ')[1];
      if (!token) throw new UnauthorizedException('Unauthorized.');

      const { id } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt.accessToken.secret'),
      });

      const userInfo = await this.redis.get(id.toString());
      if (!userInfo) {
        request.session = null;
        throw new ForbiddenException('Cannot acquire user info. Please log in again.');
      }

      request.userInfo = JSON.parse(userInfo);

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException({ message: error.message }, error.getStatus());
      }
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Access token expired.');
      }
      throw new Error(error.message || 'Unknown error occurred.');
    }
  }
}

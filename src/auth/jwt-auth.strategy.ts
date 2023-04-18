import { Request } from 'express';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import UserInfo from 'src/utils/interfaces/user-info.interface';

const configService = new ConfigService();

@Injectable()
export class JWTAuthStrategy extends PassportStrategy(Strategy, 'accessTokenAuth') {
  constructor(private readonly db: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JWTAuthStrategy.extractToken]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  private static extractToken(req: Request): string {
    const accessToken = req?.get('authorization')?.replace('Bearer', '').trim();
    if (!accessToken) throw new UnauthorizedException('Unauthorized access.');
    return accessToken;
  }

  async validate(payload: UserInfo): Promise<UserInfo> {
    const authenticatedUser = await this.db.user.findUnique({ where: { id: payload.id } });
    if (!authenticatedUser) throw new NotFoundException('User account does not exist or has been deleted.');

    return payload;
  }
}

import { Request, Response } from 'express';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

const configService = new ConfigService();

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService, private readonly jwt: JwtService) {}

  //POST /auth/register
  async register(req: Request, registerDto: AuthDto) {
    if (req.cookies?.refreshToken) throw new ConflictException('Someone is already logged in.');

    const conflictUserEmail = await this.db.user.findUnique({ where: { email: registerDto.email } });
    if (conflictUserEmail) throw new ConflictException('User with this email already exists.');

    const hashedPassword = await this.hashPassword(registerDto.password);

    const createUser = {
      email: registerDto.email,
      password: hashedPassword,
    };
    await this.db.user.create({ data: createUser });

    return { message: 'Registration successful. Now you can log in.' };
  }
  //POST /auth/login
  async login(req: Request, res: Response, loginDto: AuthDto) {
    if (req.cookies?.refreshToken) await this.clearCookie(req.cookies.refreshToken, res);

    const loggedUser = await this.db.user.findUnique({ where: { email: loginDto.email.toLowerCase() } });
    if (!loggedUser) throw new NotFoundException('User with this email does not exist.');

    if (!loggedUser.verified) throw new UnauthorizedException('User is not verified.');

    const checkPassword = await this.checkPassword(loginDto.password, loggedUser.password);
    if (!checkPassword) throw new UnauthorizedException('Invalid email or password.');

    const accessToken = await this.getToken({ id: loggedUser.id, email: loggedUser.email }, 'access');
    const refreshToken = await this.getToken({ id: loggedUser.id, email: loggedUser.email }, 'refresh');

    await this.db.refreshToken.create({
      data: { token: refreshToken, expirationDate: Date.now() + 90 * 24 * 3600 * 1000, user_id: loggedUser.id },
    });

    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: configService.get<string>('ENV') !== 'test' ? true : false,
        maxAge: 90 * 24 * 3600 * 1000, //90 days
      })
      .send({
        userInfo: {
          id: loggedUser.id,
          email: loggedUser.email,
        },
        accessToken: accessToken,
      });
  }
  //GET /auth/refreshAccessToken
  async refreshAccessToken(req: Request, res: Response) {
    if (!req.cookies?.refreshToken) throw new UnauthorizedException('Unauthorized access.');

    const checkedToken = await this.db.refreshToken.findUnique({ where: { token: req.cookies.refreshToken } });
    if (!checkedToken) throw new UnauthorizedException('Unauthorized access.');

    const userInfo = await this.jwt.verifyAsync(req.cookies.refreshToken, {
      secret: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });
    if (!userInfo) throw new UnauthorizedException('Unauthorized access.');

    const accessToken = await this.getToken({ id: userInfo.id, email: userInfo.email }, 'access');

    return res.send({ accessToken });
  }
  //GET /auth/logout
  async logout(req: Request, res: Response) {
    if (!req.cookies?.refreshToken) return res.end();

    const checkedToken = await this.db.refreshToken.findUnique({ where: { token: req.cookies.refreshToken } });

    if (checkedToken) await this.db.refreshToken.delete({ where: { token: req.cookies.refreshToken } });

    return res
      .clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: configService.get<string>('ENV') !== 'test' ? true : false,
      })
      .end();
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async checkPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async clearCookie(refreshTokenCookie: string, res: Response) {
    const checkedToken = await this.db.refreshToken.findUnique({ where: { token: refreshTokenCookie } });

    if (checkedToken) await this.db.refreshToken.delete({ where: { token: refreshTokenCookie } });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: configService.get<string>('ENV') !== 'test' ? true : false,
    });
    throw new ConflictException('Someone is already logged in. Log out or try again.');
  }

  async getToken(userInfo: { id: string; email: string }, type: 'access' | 'refresh') {
    if (type === 'access') {
      const accessToken = await this.jwt.signAsync(userInfo, {
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '20m',
      });
      if (!accessToken) throw new InternalServerErrorException('Internal server error.');
      return accessToken;
    }
    if (type === 'refresh') {
      const refreshToken = await this.jwt.signAsync(userInfo, {
        secret: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '90d',
      });
      if (!refreshToken) throw new InternalServerErrorException('Internal server error.');
      return refreshToken;
    }
  }
}

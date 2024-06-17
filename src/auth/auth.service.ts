import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import bcrypt from 'bcrypt';
import { UserInfoDto } from '../users/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRedis('sessions')
    private readonly redis: Redis,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.usersRepository.findOneBy({ email: data.email });
    if (existingUser) throw new ConflictException('User with this email already exists.');

    const hashedPassword = await this.hashPassword(data.password);

    const user = this.usersRepository.create({ ...data, password: hashedPassword });
    await this.usersRepository.save(user);

    return user;
  }

  async login(data: LoginDto) {
    const user = await this.usersRepository.findOneBy({ email: data.email });
    if (!user) throw new NotFoundException('Wrong password or user not found.');

    const rightPassword = await bcrypt.compare(data.password, user.password);
    if (!rightPassword) throw new NotFoundException('Wrong password or user not found.');

    return user;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async generateAccessToken(userInfo: UserInfoDto) {
    return this.jwtService.signAsync(userInfo, {
      secret: this.configService.get('jwt.accessToken.secret'),
      expiresIn: this.configService.get('jwt.accessToken.expiresIn'),
    });
  }

  async generateRefreshToken(userId: number) {
    return this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get('jwt.refreshToken.secret'),
        expiresIn: this.configService.get('jwt.refreshToken.expiresIn'),
      },
    );
  }

  async cacheUserInfo(userInfo: UserInfoDto) {
    return this.redis.set(
      userInfo.id.toString(),
      JSON.stringify(userInfo),
      'EX',
      this.configService.get('jwt.refreshToken.expiresIn'),
    );
  }

  setSession(session: Record<string, unknown>, refreshToken: string) {
    session.refreshToken = refreshToken;
  }

  clearSession(session: Record<string, unknown>) {
    if (session?.refreshToken) {
      session.refreshToken = undefined;
    }
  }
}

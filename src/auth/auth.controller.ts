import { Controller, HttpCode, UseGuards, Get, Post, Body, Session } from '@nestjs/common';
import { RegisterDto, RegisterResDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Serialize } from '../common/decorators/serialize.decorator';
import { LoginDto, LoginResDto } from './dtos/login.dto';
import { RefreshAccessTokenGuard } from '../common/guards/refresh-access-token.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserInfoDto } from '../users/dtos/user.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  @HttpCode(201)
  @Serialize(RegisterResDto)
  async register(@Body() body: RegisterDto, @Session() session: Record<string, unknown>) {
    const user = await this.authService.register(body);

    const userInfo = this.usersService.prepareUserInfo(user);

    const accessToken = await this.authService.generateAccessToken(userInfo);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    await this.authService.cacheUserInfo(userInfo);
    this.authService.setSession(session, refreshToken);

    return { message: ['Registered successfully.'], userInfo, accessToken };
  }

  @Post('/login')
  @HttpCode(200)
  @Serialize(LoginResDto)
  async login(@Body() body: LoginDto, @Session() session: Record<string, unknown>) {
    const user = await this.authService.login(body);

    const userInfo = this.usersService.prepareUserInfo(user);

    const accessToken = await this.authService.generateAccessToken(userInfo);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    await this.authService.cacheUserInfo(userInfo);
    this.authService.setSession(session, refreshToken);

    return { message: ['Logged in successfully.'], userInfo, accessToken };
  }

  @Get('/refreshAccessToken')
  @HttpCode(201)
  @UseGuards(RefreshAccessTokenGuard)
  async refreshAccessToken(@CurrentUser() userInfo: UserInfoDto) {
    const accessToken = await this.authService.generateAccessToken(userInfo);

    return { accessToken };
  }

  @Get('/logout')
  @HttpCode(204)
  async logout(@Session() session: Record<string, unknown>) {
    return this.authService.clearSession(session);
  }
}

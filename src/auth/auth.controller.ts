import { Request, Response } from 'express';
import { Controller, HttpCode, Req, Res } from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  async register(@Req() req: Request, @Body() registerDto: AuthDto) {
    return await this.authService.register(req, registerDto);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Req() req: Request, @Res() res: Response, @Body() loginDto: AuthDto) {
    return await this.authService.login(req, res, loginDto);
  }

  @Get('/refreshAccessToken')
  @HttpCode(201)
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    return await this.authService.refreshAccessToken(req, res);
  }

  @Get('/logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res() res: Response) {
    return await this.authService.logout(req, res);
  }
}

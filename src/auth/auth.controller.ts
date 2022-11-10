import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServcie: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
  ) {
    return this.authServcie.login(res, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async isAuthenticated() {
    return true;
  }
}

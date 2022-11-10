import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JWT_TOKEN } from '../common/common.constants';
import { JwtService } from '../jwt/jwt.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login(res: Response, user: User) {
    try {
      const token = this.jwtService.signAccessToken({ userId: user.id });
      res.cookie(JWT_TOKEN, token, { httpOnly: true });
    } catch (error) {
      console.error('login error');
    }
  }
}

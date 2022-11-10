import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_TOKEN } from '../../common/common.constants';
import { JwtService, TokenPayload } from '../../jwt/jwt.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies[JWT_TOKEN],
      ]),
      secretOrKey: configService.get('ACCESS_TOKEN_PRIVATE_KEY'),
    });
  }

  async validate({ userId }: TokenPayload) {
    const { user } = await this.userService.findUserById({ id: userId });
    return user;
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as jwt from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { User } from '../user/entities/user.entity'
import { JwtModuleOptions } from './jwt.interface'

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: JwtModuleOptions,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}
  signAccessToken(userId: number): string {
    return jwt.sign({ id: userId }, this.options.accessTokenPrivateKey, {
      expiresIn: '1d',
    })
  }
  signRefreshToken(userId: number): string {
    return jwt.sign({ id: userId }, this.options.refreshTokenPrivateKey, {
      expiresIn: '7d',
    })
  }
  verifyAccessToken(token: string): string | jwt.JwtPayload | null {
    try {
      return jwt.verify(token, this.options.accessTokenPrivateKey)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return null
      }
      return null
    }
  }
  async verifyRefreshToken(
    token: string,
  ): Promise<string | jwt.JwtPayload | null> {
    try {
      const decoded = jwt.verify(token, this.options.refreshTokenPrivateKey)
      if (!decoded) return null
      if (typeof decoded === 'object') {
        const user = await this.users.findOneBy(decoded.id)
        if (user) {
          if (user.refreshToken === token) {
            return decoded
          } else {
            return null
          }
        } else {
          return null
        }
      } else {
        return null
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return null
      }
      return null
    }
  }
}

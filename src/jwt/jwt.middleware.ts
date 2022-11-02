import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { UserService } from '../user/user.service'
import { JwtService } from './jwt.service'
import { ACCESS_TOKEN, DOMAIN, REFRESH_TOKEN } from '../common/common.constants'
import { cookieOptions } from '../common/common.config'

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = await this.jwtService.verifyAccessToken(
      req.cookies[ACCESS_TOKEN],
    )
    const refreshToken = await this.jwtService.verifyRefreshToken(
      req.cookies[REFRESH_TOKEN],
    )

    // const [, token] = req.headers.authorization.split(' ')

    if (accessToken === null) {
      if (refreshToken === null) {
        console.log('토큰 모두 만료')
        res.clearCookie(ACCESS_TOKEN, {
          domain: process.env.NODE_ENV === 'production' ? DOMAIN : 'localhost',
        })
        res.clearCookie(REFRESH_TOKEN, {
          domain: process.env.NODE_ENV === 'production' ? DOMAIN : 'localhost',
        })
        req['user'] = null
        next()
      } else {
        console.log('Access Token 만 만료')
        const userId = refreshToken['id']
        const { user } = await this.userService.findUserById({ id: userId })
        if (refreshToken === user.refreshToken) {
          console.log('Access Token 갱신')
          const { token } = await this.userService.updateAccessToken({ userId })
          res.clearCookie(ACCESS_TOKEN, {
            domain:
              process.env.NODE_ENV === 'production' ? DOMAIN : 'localhost',
          })
          res.cookie(ACCESS_TOKEN, token, cookieOptions)
          req['user'] = user
        } else {
          console.log('Refresh Token 이 유효하지 않아 초기화')
          res.clearCookie(ACCESS_TOKEN, {
            domain:
              process.env.NODE_ENV === 'production' ? DOMAIN : 'localhost',
          })
          res.clearCookie(REFRESH_TOKEN, {
            domain:
              process.env.NODE_ENV === 'production' ? DOMAIN : 'localhost',
          })
          req['user'] = null
        }
        next()
      }
    } else {
      if (refreshToken === null) {
        console.log('Refresh Token 만 만료')
        const userId = accessToken['id']
        const { user } = await this.userService.findUserById({ id: userId })
        const { token } = await this.userService.updateRefreshToken({ userId })
        res.clearCookie(REFRESH_TOKEN, {
          domain: process.env.NODE_ENV === 'production' ? DOMAIN : 'localhost',
        })
        res.cookie(REFRESH_TOKEN, token, cookieOptions)
        if (user) {
          req['user'] = user
        } else {
          req['user'] = null
        }
        next()
      } else {
        console.log('토큰 모두 살아 있음')
        const userId = accessToken['id']
        const { user } = await this.userService.findUserById({ id: userId })
        req['user'] = user
        next()
      }
    }
  }
}

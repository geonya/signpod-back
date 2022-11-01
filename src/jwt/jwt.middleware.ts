import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { UserService } from '../user/user.service'
import { JwtService } from './jwt.service'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../common/common.constants'

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
        res.clearCookie(ACCESS_TOKEN)
        res.clearCookie(REFRESH_TOKEN)
        req['user'] = null
        next()
      } else {
        console.log('Access Token 만 만료')
        console.log(refreshToken)
        const userId = refreshToken['id']
        const { user } = await this.userService.findUserById(userId)
        const { token } = await this.userService.updateAccessToken({ userId })
        res.clearCookie(ACCESS_TOKEN)
        res.cookie(ACCESS_TOKEN, token)
        // req.cookies[ACCESS_TOKEN] = newAccessToken
        req['user'] = user
        next()
      }
    } else {
      if (refreshToken === null) {
        console.log('Refresh Token 만 만료')
        const userId = accessToken['id']
        const { user } = await this.userService.findUserById(userId)
        const { token } = await this.userService.updateRefreshToken({ userId })
        res.clearCookie(REFRESH_TOKEN)
        res.cookie(REFRESH_TOKEN, token)
        // req.cookies[REFRESH_TOKEN] = token
        req['user'] = user
        next()
      } else {
        console.log('토큰 모두 살아 있음')
        const userId = accessToken['id']
        const { user } = await this.userService.findUserById(userId)
        req['user'] = user
        next()
      }
    }
  }
}

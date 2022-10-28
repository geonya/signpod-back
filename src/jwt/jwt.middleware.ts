import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { UserService } from '../user/user.service'
import { JwtService } from './jwt.service'
import { ExtractJwt } from 'passport-jwt'
import {
  ACCESS_TOKEN,
  JWT_TOKEN,
  REFRESH_TOKEN,
} from '../common/common.constants'

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = this.jwtService.verifyAccessToken(
      req.cookies[ACCESS_TOKEN],
    )
    const refreshToken = this.jwtService.verifyRefreshToken(
      req.cookies[REFRESH_TOKEN],
    )
    console.log(req)
    // const [, token] = req.headers.authorization.split(' ')

    if (accessToken === null) {
      if (refreshToken === null) {
        next()
      } else {
        const userId = refreshToken['id']
        const user = await this.userService.findUserById(userId)
        const newAccessToken = this.jwtService.signAccessToken(user.id)
        res.cookie(ACCESS_TOKEN, newAccessToken)
        req.cookies[ACCESS_TOKEN] = newAccessToken
        next()
      }
    } else {
      if (refreshToken === null) {
        const userId = accessToken['id']
        const user = await this.userService.findUserById(userId)
        const newRefreshToken = this.jwtService.signRefreshToken(user.id)
        user.refreshToken = newRefreshToken
        await this.userService.updateRefreshToken(userId, newRefreshToken)
        res.cookie(REFRESH_TOKEN, newRefreshToken)
        req.cookies[REFRESH_TOKEN] = newRefreshToken
        next()
      } else {
        next()
      }
    }

    // if (refreshToken) {
    //   try {
    //     const decoded = this.jwtService.signRefreshVerify(refreshToken)
    //     if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
    //       const user = await this.userService.findUserById(decoded['id'])
    //       if (user) {
    //         req['user'] = user
    //       }
    //     }
    //   } catch (error) {
    //     console.error(error)
    //     if (error.name === 'TokenExpiredError') {
    //       console.log('❌ Refresh Token Expired! 🗑')
    //       res.clearCookie(JWT_TOKEN)
    //     }
    //   }
    // }
  }
}

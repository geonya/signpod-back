import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '../jwt/jwt.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { EditAccountInput, EditAccountOutput } from './dtos/edit-account.dto'
import {
  FindUserByIdInput,
  FindUserByIdOutput,
} from './dtos/find-user-by-id.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { LogoutOutput } from './dtos/logout.dto'
import { IContext } from './user.interfaces'
import { MeOutput } from './dtos/me.dto'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../common/common.constants'
import { Response, Request } from 'express'
import { cookieOptions } from '../common/common.config'
import { RefreshTokenInput, RefreshTokenOutput } from './dtos/refresh-token.dto'
import { AccessTokenInput, AccessTokenOutput } from './dtos/access-token.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async createAccount(
    { name, password, email }: CreateAccountInput,
    ctx: { res: Response; req: Request },
  ): Promise<CreateAccountOutput> {
    try {
      const existingUser = await this.users.findOne({ where: { email } })
      if (existingUser) {
        return {
          ok: false,
          error: '이미 사용중인 이메일입니다.',
        }
      }
      const user = this.users.create({ name, password, email })
      await this.users.save(user)
      await this.login({ email, password }, ctx)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: '내부 오류',
      }
    }
  }
  async login(
    { email, password }: LoginInput,
    { res, req }: { res: Response; req: Request },
  ): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ where: { email } })
      if (!user) {
        return {
          ok: false,
          error: '유저가 존재하지 않습니다.',
        }
      }
      const correctPassword = await user.checkPassword(password)
      if (!correctPassword) {
        return {
          ok: false,
          error: '비밀번호가 틀렸습니다.',
        }
      }

      const accessToken = this.jwtService.signAccessToken(user.id)
      const refreshToken = this.jwtService.signRefreshToken(user.id)

      res.cookie(ACCESS_TOKEN, accessToken, cookieOptions)
      res.cookie(REFRESH_TOKEN, refreshToken, cookieOptions)

      user.refreshToken = refreshToken
      await this.users.save(user)

      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'login Service Internal Error',
      }
    }
  }

  async updateAccessToken({
    userId,
  }: AccessTokenInput): Promise<AccessTokenOutput> {
    try {
      const token = this.jwtService.signAccessToken(userId)
      if (token) {
        return {
          ok: true,
          token,
        }
      } else {
        return {
          ok: false,
          error: 'Token 이 만들어지지 않음',
        }
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'updateAccessToken Internal Error',
      }
    }
  }

  async updateRefreshToken({
    userId,
  }: RefreshTokenInput): Promise<RefreshTokenOutput> {
    console.log('refresh token')
    try {
      const user = await this.users.findOne({ where: { id: userId } })
      const token = this.jwtService.signRefreshToken(userId)
      if (token) {
        user.refreshToken = token
        await this.users.save(user)
        return {
          ok: true,
          token,
        }
      } else {
        return {
          ok: false,
          error: 'Token 이 만들어지지 않음',
        }
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'updateRefreshToken Internal Error',
      }
    }
  }

  async logout({ res }: IContext): Promise<LogoutOutput> {
    try {
      console.log('logout')
      res.clearCookie(ACCESS_TOKEN)
      res.clearCookie(REFRESH_TOKEN)
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'logout Service Internal Error',
      }
    }
  }

  async me(user: User): Promise<MeOutput> {
    try {
      return {
        ok: true,
        user,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'Me Service Internal Error',
      }
    }
  }

  async editAccount(
    user: User,
    { id, name, email, password }: EditAccountInput,
  ): Promise<EditAccountOutput> {
    try {
      if (user.id !== id) {
        return {
          ok: false,
          error: '권한이 없습니다.',
        }
      }
      if (name) {
        user.name = name
      }
      if (email) {
        const existingUser = await this.users.findOne({ where: { email } })
        if (existingUser) {
          return {
            ok: false,
            error: '이미 사용중인 이메일입니다.',
          }
        }
        user.email = email
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
      }
      await this.users.save(user)

      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'editAccount Service Internal Error',
      }
    }
  }

  async findUserById({ id }: FindUserByIdInput): Promise<FindUserByIdOutput> {
    try {
      const user = await this.users.findOne({ where: { id } })
      return {
        ok: true,
        user,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'findUserById 내부 에러',
      }
    }
  }
}

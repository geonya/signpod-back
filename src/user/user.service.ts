import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '../jwt/jwt.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { EditAccountInput, EditAccountOutput } from './dtos/edit-account.dto'
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { LogoutInput, LogoutOutput } from './dtos/logout.dto'
import { IContext } from './user.interfaces'
import { MeInput, MeOutput } from './dtos/me.dto'
import {
  ACCESS_TOKEN,
  JWT_TOKEN,
  REFRESH_TOKEN,
} from '../common/common.constants'
import { Response, Request } from 'express'

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
      const { token } = await this.login({ email, password }, ctx)
      if (token) {
        return {
          ok: true,
          token,
        }
      } else {
        return {
          ok: false,
          error: '토큰 오류',
        }
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

      // cookie
      const accessToken = this.jwtService.signAccessToken(user.id)
      const refreshToken = this.jwtService.signRefreshToken(user.id)

      const cookieOptions = {
        domain:
          process.env.NODE_ENV === 'production' ? '.signpod.app' : 'localhost',
        secure: process.env.NODE_ENV === 'production' ? true : false,
        path: '/',
        httpOnly: true,
      }

      res.cookie(ACCESS_TOKEN, accessToken, cookieOptions)
      res.cookie(REFRESH_TOKEN, refreshToken, cookieOptions)

      user.refreshToken = refreshToken
      await this.users.save(user)

      return {
        ok: true,
        token: accessToken,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'login Service Internal Error',
      }
    }
  }

  async updateRefreshToken(userId: number, token: string): Promise<void> {
    const user = await this.users.findOne({ where: { id: userId } })
    user.refreshToken = token
    await this.users.save(user)
  }

  async logout({ id }: LogoutInput, { res }: IContext): Promise<LogoutOutput> {
    try {
      res.clearCookie(ACCESS_TOKEN)
      res.clearCookie(REFRESH_TOKEN)
      const user = await this.users.findOne({ where: { id } })
      user.refreshToken = null
      await this.users.save(user)
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

  async getUser(getUserInput: GetUserInput): Promise<GetUserOutput> {
    try {
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'GetUser Service Internal Error',
      }
    }
  }

  async me(meInput: MeInput): Promise<MeOutput> {
    // try {
    //   const { token } = meInput
    //   const decoded = this.jwtService.signAccessVerify(token)
    //   if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
    //     const user = await this.users.findOne({ where: { id: decoded['id'] } })
    //     if (!user) {
    //       return {
    //         ok: false,
    //         error: '권한이 없습니다.',
    //       }
    //     }
    //     return {
    //       ok: true,
    //       user,
    //     }
    //   } else {
    //     return {
    //       ok: false,
    //       error: '유효하지 않은 토큰',
    //     }
    //   }
    // } catch (error) {
    //   console.error(error)
    //   return {
    //     ok: false,
    //     error: 'GetMe Service Internal Error',
    //   }
    // }
    return {
      ok: false,
      error: '이거 지워야 댐',
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

  async findUserById(id: number): Promise<User> {
    try {
      return this.users.findOne({ where: { id } })
    } catch (error) {
      return null
    }
  }
}

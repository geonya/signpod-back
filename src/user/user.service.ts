import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CookieOptions, Request, Response } from 'express'
import { Repository } from 'typeorm'
import { JWT_TOKEN } from '../jwt/jwt.constants'
import { JwtService } from '../jwt/jwt.service'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { EditAccountInput, EditAccountOutput } from './dtos/edit-account.dto'
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'
import { LogoutOutput } from './dtos/logout.dto'
import { IContext } from './user.interfaces'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async createAccount({
    name,
    password,
    email,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
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
      return {
        ok: true,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: '오류가 발생했습니다.',
      }
    }
  }
  async login(
    { email, password }: LoginInput,
    { res }: IContext,
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
      const token = this.jwtService.sign(user.id)

      const cookieOptions: CookieOptions = {
        domain: 'localhost',
        secure: false,
        path: '/',
        maxAge: 1000000,
      }
      res.cookie(JWT_TOKEN, token, cookieOptions)
      return {
        ok: true,
        token,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'login Service Internal Error',
      }
    }
  }

  async logout({ res }: IContext): Promise<LogoutOutput> {
    try {
      res.clearCookie(JWT_TOKEN)
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

  async getMe(me: User): Promise<GetUserOutput> {
    try {
      const user = await this.users.findOne({ where: { id: me.id } })
      if (!user) {
        return {
          ok: false,
          error: '권한이 없습니다.',
        }
      }
      return {
        ok: true,
        user,
      }
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'GetMe Service Internal Error',
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

  async findUserById(id: number): Promise<User> {
    try {
      return this.users.findOne({ where: { id } })
    } catch (error) {
      return null
    }
  }
}

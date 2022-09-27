import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}
  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'CreateAccount Service Internal Error',
      }
    }
  }
  async login(loginInput: LoginInput): Promise<LoginOutput> {
    try {
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        error: 'login Service Internal Error',
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
}

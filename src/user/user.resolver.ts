import { Header } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { AuthUser } from '../auth/auth-user.decorator'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto'
import { EditAccountInput, EditAccountOutput } from './dtos/edit-account.dto'
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { LogoutOutput } from './dtos/logout.dto'
import { User } from './entities/user.entity'
import { IContext } from './user.interfaces'
import { UserService } from './user.service'

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => CreateAccountOutput)
  createAccount(@Args('input') createAccountInput: CreateAccountInput) {
    return this.userService.createAccount(createAccountInput)
  }

  @Header('Access-Control-Allow-Credentials', 'true')
  @Header('Access-Control-Expose-Headers', 'Set-Cookie')
  @Header(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'production'
      ? 'https://signpod-web.vercel.app'
      : '*',
  )
  @Mutation((returns) => LoginOutput)
  login(
    @Args('input') loginInput: LoginInput,
    @Context() ctx: IContext,
  ): Promise<LoginOutput> {
    return this.userService.login(loginInput, ctx)
  }

  @Mutation((returns) => EditAccountOutput)
  editAccount(
    @AuthUser() user: User,
    @Args('input') editAccountInput: EditAccountInput,
  ): Promise<EditAccountOutput> {
    return this.userService.editAccount(user, editAccountInput)
  }

  @Mutation((returns) => LogoutOutput)
  logout(@Context() ctx: IContext): Promise<LogoutOutput> {
    return this.userService.logout(ctx)
  }

  @Query((returns) => GetUserOutput)
  getUser(@Args('input') getUserInput: GetUserInput): Promise<GetUserOutput> {
    return this.userService.getUser(getUserInput)
  }

  @Query((returns) => GetUserOutput)
  getMe(@AuthUser() me: User): Promise<GetUserOutput> {
    return this.userService.getMe(me)
  }
}

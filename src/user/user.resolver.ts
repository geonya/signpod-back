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
import { LogoutInput, LogoutOutput } from './dtos/logout.dto'
import { MeInput, MeOutput } from './dtos/me.dto'
import { User } from './entities/user.entity'
import { IContext } from './user.interfaces'
import { UserService } from './user.service'

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
    @Context() ctx: { res: Response; req: Request },
  ) {
    return this.userService.createAccount(createAccountInput, ctx)
  }

  @Mutation((returns) => LoginOutput)
  login(
    @Args('input') loginInput: LoginInput,
    @Context() ctx: { res: Response; req: Request },
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
  logout(
    @Args('input') logoutInput: LogoutInput,
    @Context() ctx: IContext,
  ): Promise<LogoutOutput> {
    return this.userService.logout(logoutInput, ctx)
  }

  @Query((returns) => GetUserOutput)
  getUser(@Args('input') getUserInput: GetUserInput): Promise<GetUserOutput> {
    return this.userService.getUser(getUserInput)
  }

  @Query((returns) => GetUserOutput)
  me(@Args('input') meInput: MeInput): Promise<MeOutput> {
    return this.userService.me(meInput)
  }
}

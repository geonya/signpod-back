import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from '../user/entities/user.entity'

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    const { req } = gqlContext
    const user: User = req['user']
    return user
  },
)

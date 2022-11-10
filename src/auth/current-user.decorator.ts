import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const getCurrentUserByContext = (context: ExecutionContext) => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  const gqlContext = GqlExecutionContext.create(context);
  return gqlContext.getContext().req.user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

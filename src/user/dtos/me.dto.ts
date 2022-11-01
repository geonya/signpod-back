import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { User } from '../entities/user.entity'
import { GetUserOutput } from './get-user.dto'

@ObjectType()
export class MeOutput extends GetUserOutput {
  @Field((type) => User, { nullable: true })
  user?: User
}

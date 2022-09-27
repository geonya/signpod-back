import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { User } from '../entities/user.entity'

@InputType('GetUserInput')
export class GetUserInput {
  @Field((type) => Int)
  id: number
}

@ObjectType()
export class GetUserOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User
}

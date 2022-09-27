import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { User } from '../entities/user.entity'

@InputType('GetUsersInput')
export class GetUsersInput {
  @Field((type) => Int, { defaultValue: 1 })
  page?: number
}

@ObjectType()
export class GetUsersOutput extends CoreOutput {
  @Field((type) => [User])
  users: User[]
}

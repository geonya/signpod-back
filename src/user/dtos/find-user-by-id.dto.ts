import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { User } from '../entities/user.entity'

@InputType('FindUserByIdInput')
export class FindUserByIdInput extends PickType(User, ['id']) {}

@ObjectType()
export class FindUserByIdOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User
}

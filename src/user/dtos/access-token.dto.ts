import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'

@InputType('AccessTokenInput')
export class AccessTokenInput {
  @Field((type) => Int)
  userId: number
}

@ObjectType()
export class AccessTokenOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  token?: string
}

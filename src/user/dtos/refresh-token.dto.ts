import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'

@InputType('RefreshTokenInput')
export class RefreshTokenInput {
  @Field((type) => Int)
  userId: number
}

@ObjectType()
export class RefreshTokenOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  token?: string
}

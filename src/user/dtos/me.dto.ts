import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { GetUserOutput } from './get-user.dto'

@InputType('MeInput')
export class MeInput {
  @Field((type) => String, { nullable: true })
  token?: string
}

@ObjectType()
export class MeOutput extends GetUserOutput {}

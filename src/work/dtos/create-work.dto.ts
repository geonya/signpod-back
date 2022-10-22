import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { CoreOutput } from '../../common/dtos/output.dto'

@InputType('CreateWorkInput')
export class CreateWorkInput {
  @Field((type) => String)
  @IsString()
  title: string

  @Field((type) => String)
  @IsString()
  description: string
}

@ObjectType()
export class CreateWorkOutput extends CoreOutput {}

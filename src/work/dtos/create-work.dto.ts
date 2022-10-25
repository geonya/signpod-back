import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { GraphQLUpload } from 'graphql-upload-minimal'
import { CoreOutput } from '../../common/dtos/output.dto'

import { Stream } from 'stream'

export interface FileUpload {
  path: string
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => Stream
}

@InputType('CreateWorkInput')
export class CreateWorkInput {
  @Field((type) => String)
  @IsString()
  title: string

  @Field((type) => String)
  @IsString()
  description: string

  @Field((type) => String)
  @IsString()
  cateogry: string
}

@ObjectType()
export class CreateWorkOutput extends CoreOutput {}

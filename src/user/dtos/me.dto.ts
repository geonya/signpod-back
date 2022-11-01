import { ObjectType } from '@nestjs/graphql'
import { FindUserByIdOutput } from './find-user-by-id.dto'

@ObjectType()
export class MeOutput extends FindUserByIdOutput {}

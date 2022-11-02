import { Field, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/output.dto'
import { Work } from '../entities/work.entity'

@ObjectType()
export class GetWorksOutput extends CoreOutput {
  @Field((type) => [Work], { nullable: true })
  works?: Work[]
}

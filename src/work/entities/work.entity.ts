import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString, Length } from 'class-validator'
import { Column, Entity, ManyToOne, RelationId } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { User } from '../../user/entities/user.entity'

@InputType('WorkInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Work extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(2, 20)
  title: string

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  @Length(2, 100)
  description?: string

  @ManyToOne((type) => User, (user) => user.works, { onDelete: 'CASCADE' })
  @Field((type) => User)
  creator: User

  @RelationId((work: Work) => work.creator)
  creatorId: number
}

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToMany, ManyToOne, RelationId } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { Work } from '../../work/entities/work.entity'

@InputType('PhotoInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Photo extends CoreEntity {
  @Column()
  @Field((type) => String)
  url: string

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  alt?: string

  @ManyToOne((type) => Work, (work) => work.photos, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  work?: Work

  @Field((type) => Int, { nullable: true })
  @RelationId((photo: Photo) => photo.work)
  workId?: number
}

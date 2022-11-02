import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString, Length } from 'class-validator'
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { Photo } from '../../photo/entities/photo.entity'
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

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  @Length(2, 100)
  category?: string

  @ManyToOne((type) => User, (user) => user.works, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @Field((type) => User)
  creator: User

  @RelationId((work: Work) => work.creator)
  creatorId: number

  @OneToMany((type) => Photo, (photo) => photo.work, {
    eager: true,
    nullable: true,
  })
  @Field((type) => [Photo])
  photos?: Photo[]
}

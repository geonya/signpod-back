import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'

@InputType('UserInput', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  name: string

  @Column()
  @Field((type) => String)
  email: string

  @Column()
  @Field((type) => String)
  password: string
}

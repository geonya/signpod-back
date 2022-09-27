import { Field, Int, ObjectType } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Field((type) => Date)
  updatedAt: Date

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

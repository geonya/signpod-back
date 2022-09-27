import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { BeforeInsert, Column, Entity } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from '@nestjs/common'

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

  async checkPassword(password: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, this.password)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Password Check Error')
    }
  }

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10)
      } catch (error) {
        console.error(error)
        throw new InternalServerErrorException('Password Hashing Error')
      }
    }
  }
}

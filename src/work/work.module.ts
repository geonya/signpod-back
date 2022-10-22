import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'
import { Work } from './entities/work.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Work, User])],
})
export class WorkModule {}

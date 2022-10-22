import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'
import { Work } from './entities/work.entity'
import { WorkService } from './work.service';

@Module({
  imports: [TypeOrmModule.forFeature([Work, User])],
  providers: [WorkService],
})
export class WorkModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Photo } from '../photo/entities/photo.entity'
import { StorageService } from '../storage/storage.service'
import { User } from '../user/entities/user.entity'
import { Work } from './entities/work.entity'
import { WorkResolver } from './work.resolver'
import { WorkService } from './work.service'

@Module({
  imports: [TypeOrmModule.forFeature([Work, User, Photo])],
  providers: [WorkResolver, WorkService, StorageService],
})
export class WorkModule {}

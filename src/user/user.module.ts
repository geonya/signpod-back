import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StorageService } from '../storage/storage.service'
import { User } from './entities/user.entity'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UserService, StorageService],
  exports: [UserService],
})
export class UserModule {}

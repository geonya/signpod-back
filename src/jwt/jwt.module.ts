import { DynamicModule, Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { User } from '../user/entities/user.entity'
import { JwtModuleOptions } from './jwt.interface'
import { JwtService } from './jwt.service'

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      imports: [TypeOrmModule.forFeature([User])],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService],
    }
  }
}

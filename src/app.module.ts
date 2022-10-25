import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/entities/user.entity'
import { UserModule } from './user/user.module'
import { JwtModule } from './jwt/jwt.module'
import { AuthModule } from './auth/auth.module'
import * as cookieParser from 'cookie-parser'
import { JwtMiddleware } from './jwt/jwt.middleware'
import { WorkModule } from './work/work.module'
import { Work } from './work/entities/work.entity'
import { StorageModule } from './storage/storage.module'
import { PhotoModule } from './photo/photo.module'
import storageConfig from './storage/storage-config'
import { Photo } from './photo/entities/photo.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      load: [storageConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      logging: process.env.NODE_ENV === 'development',
      synchronize: process.env.NODE_ENV !== 'production',
      entities: [User, Work, Photo],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      bodyParserConfig: false,
      cors: {
        origin: true,
        credentials: true,
      },
    }),
    UserModule,
    AuthModule,
    WorkModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    StorageModule,
    PhotoModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.POST })
  }
}

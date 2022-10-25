import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { graphqlUploadExpress } from 'graphql-upload-minimal'
import { AppModule } from './app.module'

const PORT = 4000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(graphqlUploadExpress({}))
  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get(ConfigService)

  await app.listen(PORT, () =>
    console.log(`🚀server is running! http://localhost:${PORT}/graphql  🚀`),
  )
}
bootstrap()

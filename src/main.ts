import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { graphqlUploadExpress } from 'graphql-upload-minimal'
import { AppModule } from './app.module'

const PORT = process.env.PORT

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(graphqlUploadExpress({}))
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT, () =>
    console.log(
      `🚀server is running! http://localhost:${PORT}/graphql & https://api.signpod.app/graphql 🚀`,
    ),
  )
}
bootstrap()

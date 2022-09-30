import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const PORT = process.env.PORT || 8080

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT, () =>
    console.log(`🚀server is running! http://localhost:${PORT}/graphql  🚀`),
  )
}
bootstrap()

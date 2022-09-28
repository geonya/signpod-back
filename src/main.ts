import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const PORT = 8080

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://signpod-web.vercel.app'
        : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'X-Requested-With', 'Set-Cookie'],
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT, () =>
    console.log(`🚀server is running! http://localhost:${PORT}/graphql  🚀`),
  )
}
bootstrap()

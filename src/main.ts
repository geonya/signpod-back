import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () =>
    console.log(
      `🚀server is running! http://localhost:${PORT}/graphql & https://api.signpod.app/graphql 🚀`,
    ),
  );
}
bootstrap();

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   const config = new DocumentBuilder()
    .setTitle('BioCad Fullstack API')
    .setDescription('API docs for BioCad fullstack test task')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  // @ts-ignore NestJS types Windows/TS bug
  const document = SwaggerModule.createDocument(app, config);
  // @ts-ignore NestJS types Windows/TS bug
  SwaggerModule.setup('swagger', app, document);
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appSession } from './config/session';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'));
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Incubator App')
    .setDescription('The Incubator Web API')
    .setVersion('0.1-alpha')
    .addTag('Incubator')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  // add session
  app.use(appSession);
  await app.listen(3000);
}
bootstrap();

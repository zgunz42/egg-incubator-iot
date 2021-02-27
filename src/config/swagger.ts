import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('Incubator')
  .setDescription('The Incubator Web API')
  .setVersion('0.1')
  .addTag('Incubator')
  .build();

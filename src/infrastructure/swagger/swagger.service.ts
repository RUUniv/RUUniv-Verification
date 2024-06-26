import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Univ Api 문서')
    .setDescription('Api 문서 입니다.')
    .setVersion('v1')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    })
    .addApiKey(
      {
        type: 'apiKey',
        name: 'ApiKey',
        description: 'Enter Api Key',
        in: 'header',
      },
      'ApiKey',
    );

  const document = SwaggerModule.createDocument(app, config.build());

  SwaggerModule.setup('swagger', app, document);
};

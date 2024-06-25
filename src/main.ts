import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupSwagger } from './infrastructure/swagger/swagger.service';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { MainModule } from './main.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { WinstonModule } from 'nest-winston';
import { generateRequestId } from './infrastructure/utils/fastify.util';


async function bootstrap() {
  const logger = WinstonModule.createLogger({
  });

  const app = await NestFactory.create(
    MainModule
  );

  
  app.enableCors()

  app
    .enableShutdownHooks()
    .enableVersioning({ type: VersioningType.URI })
    .useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    )
    .useGlobalPipes(
      new ValidationPipe(),
    );

  setupSwagger(app)

  
  
  await app.listen(3000);
}
bootstrap();

declare global {
  interface BigInt {
    toJSON(): number;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

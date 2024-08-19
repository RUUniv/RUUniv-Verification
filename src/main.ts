import { NestFactory, Reflector } from '@nestjs/core';
import { setupSwagger } from './infrastructure/swagger/swagger.service';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { MainModule } from './main.module';
import { WinstonModule } from 'nest-winston';
import { winstonTransports } from './infrastructure/utils/logger.util';
import { kafkaOptions } from './infrastructure/kafka/kafka.config';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    transports: winstonTransports,
  });

  const app = await NestFactory.create(MainModule, {
    bufferLogs: true,
    logger: logger,
  });

  app.connectMicroservice(kafkaOptions);

  app.enableCors();

  app.useLogger(logger);

  app
    .enableShutdownHooks()
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .enableVersioning({ type: VersioningType.URI })
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .useGlobalPipes(new ValidationPipe());
  setupSwagger(app);

  app.startAllMicroservices();

  await app.listen(process.env.PORT);
  logger.log(`Server is listening ${process.env.PORT}`);
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

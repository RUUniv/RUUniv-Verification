import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupSwagger } from './infrastructure/swagger/swagger.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app)
  
  await app.listen(3000);
}
bootstrap();

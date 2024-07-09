import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import {} from './infrastructure/database/database.module';
import {} from './infrastructure/database/database.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config';
import { MethodTimeMeterInterceptor } from './infrastructure/Interceptor/method.time.meter.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    AppModule,
    InfrastructureModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: MethodTimeMeterInterceptor },
  ],
})
export class MainModule {}

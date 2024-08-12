import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppModule } from './app/app.module';
import {} from './infrastructure/database/database.module';
import {} from './infrastructure/database/database.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config';
import { MethodTimeMeterInterceptor } from './common/Interceptor/method.time.meter.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { StatisticsMiddleware } from './common/middleware/statistics.middleware';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    AppModule,
    InfrastructureModule,
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'ruuniv-verification',
            brokers: ['localhost:10000', 'localhost:10001', 'localhost:10002'],
          },
          consumer: {
            groupId: 'ruuniv-verification',
          },
        },
      },
    ]),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: MethodTimeMeterInterceptor },
  ],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(StatisticsMiddleware).forRoutes('*');
  }
}

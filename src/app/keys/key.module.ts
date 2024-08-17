import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import * as redisStore from 'cache-manager-ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
import { KeyController } from './api/key.controller';
import { KeyService } from './service/key.service';
import { KafkaKeyListener } from './listener/key.kafka.listener';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      }),
    }),
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            retry: { maxRetryTime: 2 },
            clientId: 'ruuniv-verification',
            brokers: ['localhost:10000', 'localhost:10001', 'localhost:10002'],
          },
          consumer: {
            groupId: 'ruuniv-verification',
          },
        },
      },
    ]),
    DatabaseModule,
  ],
  controllers: [KeyController, KafkaKeyListener],
  providers: [KeyService],
})
export class KeyModule {}

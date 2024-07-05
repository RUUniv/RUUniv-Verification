import { Module } from '@nestjs/common';
import { VerificationService } from './service/verification.service';
import { VerificationController } from './api/verification.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { EmailService } from './service/email.service';
import { ManagerService } from './service/manager.service';
import { ManagerController } from './api/manager.controller';

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
    DatabaseModule,
  ],
  providers: [VerificationService, EmailService, ManagerService],
  controllers: [VerificationController, ManagerController],
})
export class VerificationModule {}

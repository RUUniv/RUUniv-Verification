import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EurekaModule } from 'nestjs-eureka/';

@Module({
  imports: [
    EurekaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        service: {
          name: 'ruuniv-verification-server',
          port: configService.get<number>('PORT'),
          host: configService.get<string>('HOST'),
        },
        eureka: {
          host: configService.get<string>('EUREKA_HOST'),
          port: configService.get<number>('EUREKA_PORT'),
          servicePath: '/eureka/apps/',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [EurekaModule],
})
export class DiscoveryModule {}

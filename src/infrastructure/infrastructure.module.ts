import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { KafkaModule } from './kafka/kafka.module';
import { DiscoveryModule } from './eureka/discovery.module';

@Module({
  imports: [DatabaseModule, KafkaModule, DiscoveryModule],
})
export class InfrastructureModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [DatabaseModule, KafkaModule],
})
export class InfrastructureModule {}

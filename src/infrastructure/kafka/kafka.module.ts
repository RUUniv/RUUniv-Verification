import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
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
})
export class KafkaModule {}

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
            brokers: [
              process.env.KAFKA_SERVER_1,
              process.env.KAFKA_SERVER_2,
              process.env.KAFKA_SERVER_3,
            ],
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

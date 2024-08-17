import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaOptions: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:10000', 'localhost:10001', 'localhost:10002'],
    },
  },
};

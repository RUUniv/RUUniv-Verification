import { Controller, Inject, Logger } from '@nestjs/common';
import { KeyService } from '../service/key.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import {
  KAFKA_TOPIC_CREATE_API_KEY,
  KAFKA_TOPIC_DELETE_API_KEY,
} from 'src/infrastructure/kafka/kafka.topic';

@Controller()
export class KafkaKeyListener {
  constructor(
    private readonly keyService: KeyService,
    @Inject('KAFKA') private readonly kafka: ClientKafka,
  ) {}
  private readonly logger = new Logger(KafkaKeyListener.name);

  @EventPattern(KAFKA_TOPIC_CREATE_API_KEY)
  async createApiKeyHandler(data: any) {
    this.logger.log('Create Api Key Event Start');
    this.keyService.createApiKey(data);
  }

  @EventPattern(KAFKA_TOPIC_DELETE_API_KEY)
  async deleteApiKeyHandler(data: any) {
    this.logger.log('Delete Api Key Event Start');
    this.keyService.deleteApiKey(data.userId, data.apiKey);
  }
}

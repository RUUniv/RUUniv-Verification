import { Controller, Inject, Logger } from '@nestjs/common';
import { KeyService } from '../service/key.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import {
  KAFKA_TOPIC_CREATE_API_KEY,
  KAFKA_TOPIC_DELETE_API_KEY,
  KAFKA_TOPIC_ROLLBACK_CREATE_API_KEY,
  KAFKA_TOPIC_ROLLBACK_DELETE_API_KEY,
} from 'src/infrastructure/kafka/kafka.topic';

@Controller()
export class KafkaKeyListener {
  constructor(
    private readonly keyService: KeyService,
    @Inject('KAFKA') private readonly kafkaProducer: ClientKafka,
  ) {}
  private readonly logger = new Logger(KafkaKeyListener.name);

  @EventPattern(KAFKA_TOPIC_CREATE_API_KEY)
  async createApiKeyHandler(payload: any) {
    try {
      this.logger.log('Create Api Key Event Start');
      await this.keyService.createApiKey(payload.userId);
    } catch (e) {
      this.logger.log('Create Api Key Event Failure');
      this.kafkaProducer.emit(
        KAFKA_TOPIC_ROLLBACK_CREATE_API_KEY,
        payload.userId,
      );
    }
  }

  @EventPattern(KAFKA_TOPIC_DELETE_API_KEY)
  async deleteApiKeyHandler(payload: any) {
    try {
      this.logger.log('Delete Api Key Event Start');
      await this.keyService.deleteApiKey(payload.userId, payload.apiKey);
    } catch (e) {
      this.logger.log('Delete Api Key Event Failure');
      this.kafkaProducer.emit(
        KAFKA_TOPIC_ROLLBACK_DELETE_API_KEY,
        payload.userId,
      );
    }
  }
}

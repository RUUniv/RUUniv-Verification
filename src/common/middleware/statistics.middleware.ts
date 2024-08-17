import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { NextFunction, Request, Response } from 'express';
import { KAFKA_TOPIC_COLLECT_STATISTICS } from 'src/infrastructure/kafka/kafka.topic';

@Injectable()
export class StatisticsMiddleware implements NestMiddleware {
  constructor(@Inject('KAFKA') private readonly kafkaProducer: ClientKafka) {}
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const apiKey = request.get('ApiKey') || '';

    response.on('finish', () => {
      if (originalUrl.includes('/v1/verification')) {
        const { statusCode } = response;
        this.kafkaProducer.emit(KAFKA_TOPIC_COLLECT_STATISTICS, {
          apiUrl: originalUrl,
          method: method,
          status: statusCode,
          apiKey: apiKey,
        });
      }
    });

    next();
  }
}

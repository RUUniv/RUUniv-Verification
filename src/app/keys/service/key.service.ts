import { Injectable, Logger } from '@nestjs/common';
import { ApiKey } from '@prisma/client';
import { randomUUID } from 'crypto';
import { ApiKeyNotFoundError } from 'src/common/errors/apiKey.error';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class KeyService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger = new Logger(KeyService.name);

  async createApiKey(userId: bigint): Promise<ApiKey> {
    const apiKey = await randomUUID();
    this.logger.log(`Create ApiKey : ${apiKey}`);

    return this.databaseService.apiKey.create({
      data: {
        apiKey: apiKey,
        userId: userId,
      },
    });
  }

  async getApiKeys(userId: bigint): Promise<ApiKey[]> {
    return this.databaseService.apiKey.findMany({
      where: { userId: userId },
    });
  }

  async deleteApiKey(userId: bigint, apiKeyId: bigint) {
    const apiKey = await this.databaseService.apiKey.findUnique({
      where: { id: apiKeyId, userId },
    });

    if (apiKey == null) {
      throw new ApiKeyNotFoundError();
    }

    await this.databaseService.student.deleteMany({
      where: { apiKeyId: apiKeyId },
    });

    await this.databaseService.apiKey.delete({
      where: { id: apiKeyId, userId: userId },
    });
  }
}

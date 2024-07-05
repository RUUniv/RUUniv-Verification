import { ApiKey } from './../../../../node_modules/.prisma/client/index.d';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import {
  ApiKeyNotFoundError,
  ToManyApiKeyError,
} from 'src/common/errors/apiKey.error';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createApiKey(userId: bigint): Promise<ApiKey> {
    if ((await this.databaseService.apiKey.count({ where: { userId } })) > 2) {
      throw new ToManyApiKeyError();
    }
    const apiKey = await randomUUID();

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

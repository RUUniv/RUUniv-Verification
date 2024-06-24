import { ApiKey } from './../../../../node_modules/.prisma/client/index.d';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { ApiKeyResponse } from '../dto/apiKey.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly databaseService : DatabaseService
    ) { }
    
    async createApiKey(userId: number): Promise<ApiKeyResponse> {
        const user = await this.databaseService.user.findUnique({ where: { id: userId } });
        
        const apiKey = await randomUUID();

        await this.databaseService.apiKey.create({
            data: {
                apiKey: apiKey,
                userId: user.id
            }
        });

        return {
            apiKey: apiKey
        }
    }
}

import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { KeyService } from '../service/key.service';
import { ApiKeyResponse } from '../dto/key.dto';

@ApiTags('키')
@Controller({ path: 'keys', version: '1' })
export class KeyController {
  constructor(private readonly keyService: KeyService) {}
  private readonly logger = new Logger(KeyController.name);

  @Get('me')
  @ApiOkResponse({ type: ApiKeyResponse })
  async getApiKeys(@Query('userId') userId: bigint): Promise<ApiKeyResponse[]> {
    const apiKeys = await this.keyService.getApiKeys(userId);
    return apiKeys.map(
      (apiKey) =>
        new ApiKeyResponse({ apiKeyId: apiKey.id, apiKey: apiKey.apiKey }),
    );
  }
}

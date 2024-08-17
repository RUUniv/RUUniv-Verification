import { Controller, Get, Headers, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KeyService } from '../service/key.service';

@ApiTags('키')
@Controller({ path: 'keys', version: '1' })
export class KeyController {
  constructor(private readonly keyService: KeyService) {}
  private readonly logger = new Logger(KeyController.name);

  @Get('me')
  async getApiKeys(@Headers() headers: any) {
    await this.keyService.getApiKeys(headers.userId);
  }
}

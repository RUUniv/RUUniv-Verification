import { ApiProperty } from '@nestjs/swagger';
/**
 * Request
 */

/**
 * Response
 */

export class ApiKeyResponse {
  constructor(data: ApiKeyResponse) {
    this.apiKey = data.apiKey;
    this.apiKeyId = data.apiKeyId;
  }

  @ApiProperty({
    description: 'Api Key',
    example: 'asd-asd-asd',
  })
  apiKey: string;

  @ApiProperty({
    description: 'Api Key Id',
    example: '1',
  })
  apiKeyId: bigint;
}

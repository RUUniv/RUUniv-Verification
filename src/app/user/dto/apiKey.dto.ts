import { ApiProperty } from '@nestjs/swagger';

/**
 *  Response
 */

export class ApiKeyResponse {
  constructor(data: ApiKeyResponse) {
    this.apiKey = data.apiKey;
    this.id = data.id;
  }

  @ApiProperty({
    description: 'Api Key Id',
    example: '1',
  })
  id: bigint;

  @ApiProperty({
    description: '인증용 apiKey',
    example: 'asd-asd...',
  })
  apiKey: string;
}

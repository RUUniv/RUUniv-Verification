/**
 *  Response
 */

import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({
    description: '인증용 토큰 (AccessToken)',
    example: 'eyJ...',
  })
  accessToken: string;

  @ApiProperty({
    description: '갱신용 토큰 (RefreshToken)',
    example: 'eyJ...',
    nullable: true,
  })
  refreshToken: string;
}

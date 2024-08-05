import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  constructor(data: BaseResponse) {
    this.message = data.message;
    this.isSuccess = data.isSuccess;
    this.data = data.data;
  }

  @ApiProperty({
    description: '메시지',
    example: 'email@naver.com',
  })
  message: string;

  @ApiProperty({
    description: 'API 동작 성공 여부',
    example: 'true',
  })
  isSuccess: boolean;

  @ApiProperty({
    description: '데이터',
    example: '{"response" : "data"}',
  })
  data: object;
}

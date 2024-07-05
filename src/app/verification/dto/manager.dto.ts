import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegistryStudentRequest {
  @ApiProperty({
    description: 'Email',
    example: 'email@naver.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'University Name',
    example: '서울시립대학교',
  })
  @IsNotEmpty()
  universityName: string;
}

/**
 * Request
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EmailVerificationRequest {
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

export class VerifyEmailRequest {
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

  @ApiProperty({
    description: '6자리 숫자',
    example: '123675',
  })
  @IsNotEmpty()
  authCode: string;
}

/**
 * Response
 */

export class EmailVerificationResponse {
  constructor(data: EmailVerificationResponse) {
    this.email = data.email;
    this.universityName = data.universityName;
    this.isSend = data.isSend;
  }

  @ApiProperty({
    description: '이메일',
    example: 'email@naver.com',
  })
  email: string;

  @ApiProperty({
    description: '대학명',
    example: '서울시립대학교',
  })
  universityName: string;

  @ApiProperty({
    description: '메일 발송 여부',
    example: 'true',
  })
  isSend: boolean;
}

export class VerifyEmailResponse {
  constructor(data: VerifyEmailResponse) {
    this.email = data.email;
    this.universityName = data.universityName;
    this.isVerify = data.isVerify;
  }

  @ApiProperty({
    description: '이메일',
    example: 'email@naver.com',
  })
  email: string;

  @ApiProperty({
    description: '대학명',
    example: '서울시립대학교',
  })
  universityName: string;

  @ApiProperty({
    description: '인증 완료 여부',
    example: 'true',
  })
  isVerify: boolean;
}

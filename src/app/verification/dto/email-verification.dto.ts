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
    this.university = data.university;
    this.status = data.status;
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
  university: string;

  @ApiProperty({
    description: '메일 인증 상태',
    example: 'true',
  })
  status: boolean;
}

export class VerifyEmailResponse {
  constructor(data: VerifyEmailResponse) {
    this.email = data.email;
    this.university = data.university;
    this.status = data.status;
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
  university: string;

  @ApiProperty({
    description: '인증 완료 여부',
    example: 'true',
  })
  status: boolean;
}

export class DeleteStudentsResponse {
  constructor(data: DeleteStudentsResponse) {
    this.status = data.status;
  }

  @ApiProperty({
    description: '삭제 인증 상태',
    example: 'true',
  })
  status: boolean;
}

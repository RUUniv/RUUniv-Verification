import { Options } from '@nestjs/common';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 *  Request
 */

export class SignUpRequest {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: '이메일', example: 'univ@gmail.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호', example: 'asdf1234' })
  password: string;
}

export class SignInRequest {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: '이메일', example: 'univ@gmail.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호', example: 'asdf1234' })
  password: string;
}

/**
 * Response
 */

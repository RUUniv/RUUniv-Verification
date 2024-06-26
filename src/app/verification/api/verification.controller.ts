import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerificationService } from '../service/verification.service';
import { ApiKeyAuthGuard } from 'src/app/auth/guard/apiKey.guard';
import {
  DeleteStudentsResponse,
  EmailVerificationRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '../dto/email-verification.dto';
import {
  AuthCodeNotFoundError,
  AuthCodeNotFoundException,
  DuplicatedVerificationError,
  DuplicatedVerificationException,
  InvalidAuthCodeError,
  InvalidAuthCodeException,
  UniversityNotFoundError,
  UniversityNotFoundException,
} from 'src/common/errors/verification.error';
import { StudentReponse } from '../dto/verification.dto';
import { EmailVerificationResponse } from '../dto/email-verification.dto';

@ApiTags('검증')
@Controller({ path: 'verification', version: '1' })
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('/email')
  @ApiOperation({
    operationId: '학생 인증 메일 발송',
    summary: '학생 인증 메일 발송',
    description: '학생 인증 메일 발송을 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: EmailVerificationResponse })
  async createEmailVerification(
    @Body() body: EmailVerificationRequest,
  ): Promise<EmailVerificationResponse> {
    try {
      const response =
        await this.verificationService.createEmailVerification(body);

      return new EmailVerificationResponse({
        email: body.email,
        university: body.universityName,
        status: response,
      });
    } catch (e) {
      if (e instanceof UniversityNotFoundError) {
        throw new UniversityNotFoundException();
      }
    }
  }

  @Post('/email/verify')
  @ApiOperation({
    operationId: '학생 인증 메일 검증',
    summary: '학생 인증 메일 검증',
    description: '학생 인증 메일 검증을 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: VerifyEmailResponse })
  async verifyEmail(
    @Req() req: any,
    @Body() body: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> {
    try {
      const response = await this.verificationService.verifyEmail(
        body,
        req.user,
      );

      return new VerifyEmailResponse({
        email: response.email,
        university: response.universityName,
        status: true,
      });
    } catch (e) {
      if (e instanceof AuthCodeNotFoundError) {
        throw new AuthCodeNotFoundException();
      }

      if (e instanceof InvalidAuthCodeError) {
        throw new InvalidAuthCodeException();
      }

      if (e instanceof DuplicatedVerificationError) {
        throw new DuplicatedVerificationException();
      }

      throw new InternalServerErrorException(e);
    }
  }

  @Delete('/email')
  @ApiOperation({
    operationId: '해당 API키에 인증된 학생 전체 삭제',
    summary: '해당 API키에 인증된 학생 전체 삭제',
    description: '해당 API키에 인증된 학생 전체 삭제를 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: DeleteStudentsResponse })
  async deleteVerifiedStudents(
    @Req() req: any,
  ): Promise<DeleteStudentsResponse> {
    const response = await this.verificationService.deleteVerifiedStudents(
      req.user,
    );

    return new DeleteStudentsResponse({
      status: response,
    });
  }
}

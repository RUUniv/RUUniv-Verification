import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerificationService } from '../service/verification.service';
import { ApiKeyAuthGuard } from 'src/app/auth/guard/apiKey.guard';
import {
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
  NotSupportedUniversityError,
  NotSupportedUniversityException,
  UniversityNotFoundError,
  UniversityNotFoundException,
} from 'src/common/errors/verification.error';
import { DeleteStudentsResponse } from '../dto/verification.dto';
import { EmailVerificationResponse } from '../dto/email-verification.dto';
import { SupportedUniversityResponse } from '../dto/verification.dto';

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
        universityName: body.universityName,
        isSend: response,
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
        universityName: response.universityName,
        isVerify: true,
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
      isDelete: response,
    });
  }

  @Get('')
  @ApiOperation({
    operationId: '인증을 지원하는 대학 전체 목록 조회',
    summary: '인증을 지원하는 대학 목록 전체 조회',
    description: '인증을 지원하는 대학 목록 전체 조회를 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: SupportedUniversityResponse })
  async getAllSupportedUniversity(): Promise<string[]> {
    return this.verificationService.getAllSupportedUniversity();
  }

  @Get(':university')
  @ApiOperation({
    operationId: '해당 대학이 지원되는지 조회',
    summary: '해당 대학이 지원되는지 조회',
    description: '해당 대학이 지원되는지 확인합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: SupportedUniversityResponse })
  async checkSupportedUniversity(
    @Req() req: any,
    @Param('university') universityName: string,
  ): Promise<SupportedUniversityResponse> {
    try {
      const response =
        await this.verificationService.checkSupportedUniversity(universityName);

      return new SupportedUniversityResponse({
        isSupported: response,
        universityName: universityName,
      });
    } catch (e) {
      if (e instanceof NotSupportedUniversityError) {
        throw new NotSupportedUniversityException();
      }
    }
  }
}

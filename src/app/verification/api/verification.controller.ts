import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
import {
  DeleteStudentsResponse,
  StudentResponse,
} from '../dto/verification.dto';
import { EmailVerificationResponse } from '../dto/email-verification.dto';
import { SupportedUniversityResponse } from '../dto/verification.dto';
import { BaseResponse } from '../dto/base-response';

@ApiTags('검증')
@ApiBasicAuth('ApiKey')
@Controller({ path: 'verification', version: '1' })
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}
  private readonly logger = new Logger(VerificationController.name);

  /*
   * 대학생 인증 기능
   * */
  @Post('/email')
  @ApiOperation({
    operationId: '학생 인증 메일 발송',
    summary: '학생 인증 메일 발송',
    description: '학생 인증 메일 발송을 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: BaseResponse })
  async createEmailVerification(
    @Body() body: EmailVerificationRequest,
  ): Promise<BaseResponse> {
    try {
      const response =
        await this.verificationService.createEmailVerification(body);

      return new BaseResponse({
        message: 'Success',
        data: new EmailVerificationResponse({
          email: body.email,
          universityName: body.universityName,
          isSend: response,
        }),
        isSuccess: true,
      });
    } catch (e) {
      this.logger.error(e);
      if (e instanceof UniversityNotFoundError) {
        return new BaseResponse({
          message: 'University Not Found',
          data: null,
          isSuccess: false,
        });
      }

      return new BaseResponse({
        message: 'Internal Server Error',
        data: null,
        isSuccess: false,
      });
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
  @ApiOkResponse({ type: BaseResponse })
  async verifyEmail(
    @Req() req: any,
    @Body() body: VerifyEmailRequest,
  ): Promise<BaseResponse> {
    try {
      const response = await this.verificationService.verifyEmail(
        body,
        req.user,
      );

      return new BaseResponse({
        message: 'Success',
        data: new VerifyEmailResponse({
          email: response.email,
          universityName: response.universityName,
          isVerify: true,
        }),
        isSuccess: true,
      });
    } catch (e) {
      this.logger.error(e);
      if (e instanceof AuthCodeNotFoundError) {
        return new BaseResponse({
          message: 'Auth Code Not Found',
          data: null,
          isSuccess: false,
        });
      }

      if (e instanceof InvalidAuthCodeError) {
        return new BaseResponse({
          message: 'Invalid Auth Code',
          data: null,
          isSuccess: false,
        });
      }

      if (e instanceof DuplicatedVerificationError) {
        return new BaseResponse({
          message: 'Duplicated Verification',
          data: null,
          isSuccess: false,
        });
      }

      return new BaseResponse({
        message: 'Internal Server Error',
        data: null,
        isSuccess: false,
      });
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
  @ApiOkResponse({ type: BaseResponse })
  async deleteVerifiedStudents(@Req() req: any): Promise<BaseResponse> {
    const response = await this.verificationService.deleteVerifiedStudents(
      req.user,
    );

    return new BaseResponse({
      message: 'Success',
      data: new DeleteStudentsResponse({
        isDelete: response,
      }),
      isSuccess: true,
    });
  }

  @Get('/univ')
  @ApiOperation({
    operationId: '인증을 지원하는 대학 전체 목록 조회',
    summary: '인증을 지원하는 대학 목록 전체 조회',
    description: '인증을 지원하는 대학 목록 전체 조회를 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: BaseResponse })
  async getAllSupportedUniversity(): Promise<BaseResponse> {
    return new BaseResponse({
      message: 'Success',
      data: await this.verificationService.getAllSupportedUniversity(),
      isSuccess: true,
    });
  }

  @Get('/univ/:university')
  @ApiOperation({
    operationId: '해당 대학이 지원되는지 조회',
    summary: '해당 대학이 지원되는지 조회',
    description: '해당 대학이 지원되는지 확인합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: BaseResponse })
  async checkSupportedUniversity(
    @Param('university') universityName: string,
  ): Promise<BaseResponse> {
    try {
      const response =
        await this.verificationService.checkSupportedUniversity(universityName);

      return new BaseResponse({
        message: 'Success',
        data: new SupportedUniversityResponse({
          isSupported: response,
          universityName: universityName,
        }),
        isSuccess: true,
      });
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotSupportedUniversityError) {
        return new BaseResponse({
          message: 'Not Supported University',
          data: null,
          isSuccess: false,
        });
      }

      return new BaseResponse({
        message: 'Internal Server Error',
        data: null,
        isSuccess: false,
      });
    }
  }

  @Get('/student')
  @ApiOperation({
    operationId: '인증된 학생 조회',
    summary: '인증된 학생 조회',
    description: '인증된 학생 조회를 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: BaseResponse })
  async getVerifiedStudents(@Req() req: any): Promise<BaseResponse> {
    const students = await this.verificationService.getVerifiedStudents(
      req.user,
    );

    return new BaseResponse({
      message: 'Success',
      data: students.map(
        (student) =>
          new StudentResponse({
            id: student.id,
            email: student.email,
            universityName: student.universityName,
          }),
      ),
      isSuccess: true,
    });
  }
}

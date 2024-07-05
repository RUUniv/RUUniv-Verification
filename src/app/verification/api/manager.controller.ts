import {
  ApiBasicAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VerificationService } from '../service/verification.service';
import { ManagerService } from '../service/manager.service';
import { ApiKeyAuthGuard } from 'src/app/auth/guard/apiKey.guard';
import {
  DeleteStudentsResponse,
  StudentResponse,
} from '../dto/verification.dto';
import { RegistryStudentRequest } from '../dto/manager.dto';

@ApiTags('관리')
@ApiBasicAuth('ApiKey')
@Controller({ path: 'manager', version: '1' })
export class ManagerController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly manageService: ManagerService,
  ) {}
  private readonly logger = new Logger(ManagerController.name);

  /**
   * ApiKey 관리자 기능
   **/

  @Get('/student')
  @ApiOperation({
    operationId: '인증된 학생 조회',
    summary: '인증된 학생 조회',
    description: '인증된 학생 조회를 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: StudentResponse })
  async getVerifiedStudents(@Req() req: any): Promise<StudentResponse[]> {
    const students = await this.verificationService.getVerifiedStudents(
      req.user,
    );

    return students.map(
      (student) =>
        new StudentResponse({
          id: student.id,
          email: student.email,
          universityName: student.universityName,
        }),
    );
  }

  @Post('/student/:studentId')
  @ApiOperation({
    operationId: '특정 인증된 학생 삭제',
    summary: '특정 인증된 학생 삭제',
    description: '특정 인증된 학생 삭제합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: StudentResponse })
  async deleteVerifiedStudent(
    @Req() req: any,
    @Param('studentId') studentId: bigint,
  ) {
    const response = await this.manageService.deleteVerifiedStudent(
      req.user,
      studentId,
    );

    return new DeleteStudentsResponse({
      isDelete: response,
    });
  }

  @Post('/student/registry')
  @ApiOperation({
    operationId: '특정 인증된 학생 삭제',
    summary: '특정 인증된 학생 삭제',
    description: '특정 인증된 학생 삭제합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @ApiOkResponse({ type: StudentResponse })
  async registryStudent(
    @Req() req: any,
    @Body() data: RegistryStudentRequest,
  ): Promise<StudentResponse> {
    const response = await this.manageService.registryStudent(req.user, data);

    return new StudentResponse({
      id: response.id,
      email: response.email,
      universityName: response.universityName,
    });
  }
}

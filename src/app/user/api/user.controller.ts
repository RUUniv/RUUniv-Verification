import {
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
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeyResponse } from '../dto/apiKey.dto';
import {
  ApiKeyNotFoundError,
  ApiKeyNotFoundException,
  ToManyApiKeyError,
  ToManyApiKeyException,
} from 'src/common/errors/apiKey.error';

@ApiTags('유저')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @ApiOperation({
    operationId: 'API KEY 생성',
    summary: 'API KEY 생성',
    description: 'API KEY 생성을 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post('/me/apiKey')
  @ApiOkResponse({ type: ApiKeyResponse })
  async createApiKey(@Req() req: any): Promise<ApiKeyResponse> {
    try {
      this.logger.log(`Create ApiKey Start , Email : ${req.user}`);
      const apiKey = await this.userService.createApiKey(req.user.userId);
      this.logger.log(`Create ApiKey Success , Email : ${req.user}`);
      return new ApiKeyResponse({
        apiKey: apiKey.apiKey,
        id: apiKey.id,
      });
    } catch (e) {
      if (e instanceof ToManyApiKeyError) {
        throw new ToManyApiKeyException();
      }
    }
  }

  @ApiOperation({
    operationId: 'API KEY 조회',
    summary: 'API KEY 조회',
    description: 'API KEY 조회를 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/apiKey')
  @ApiOkResponse({ type: ApiKeyResponse })
  async getApiKeys(@Req() req: any): Promise<ApiKeyResponse[]> {
    this.logger.log(`Get ApiKeys Start , Email : ${req.user}`);
    const apiKeys = await this.userService.getApiKeys(req.user.userId);
    this.logger.log(`Get ApiKey Success , Email : ${req.user}`);
    return apiKeys.map(
      (apiKey) =>
        new ApiKeyResponse({
          apiKey: apiKey.apiKey,
          id: apiKey.id,
        }),
    );
  }

  @ApiOperation({
    operationId: 'API KEY 삭제',
    summary: 'API KEY 삭제',
    description: 'API KEY 삭제를 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/me/apiKey/:id')
  @ApiOkResponse({ type: ApiKeyResponse })
  async deleteApiKey(@Req() req: any, @Param('id') apiKeyId: bigint) {
    try {
      this.logger.log(`Delete ApiKey Start , Email : ${req.user}`);
      await this.userService.deleteApiKey(req.user.userId, apiKeyId);
      this.logger.log(`Delete ApiKey Success , Email : ${req.user}`);
    } catch (e) {
      if (e instanceof ApiKeyNotFoundError) {
        throw new ApiKeyNotFoundException();
      }

      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }
}

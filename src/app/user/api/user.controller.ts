import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeyResponse } from '../dto/apiKey.dto';
import { ApiKeyAuthGuard } from 'src/app/auth/guard/apiKey.guard';
import {
  ApiKeyNotFoundError,
  ApiKeyNotFoundException,
} from 'src/common/errors/apiKey.error';

@ApiTags('유저')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    const apiKey = await this.userService.createApiKey(req.user.id);

    return new ApiKeyResponse({
      apiKey: apiKey.apiKey,
      id: apiKey.id,
    });
  }

  @ApiOperation({
    operationId: 'API KEY 생성',
    summary: 'API KEY 생성',
    description: 'API KEY 생성을 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/apiKey')
  @ApiOkResponse({ type: ApiKeyResponse })
  async getApiKeys(@Req() req: any): Promise<ApiKeyResponse[]> {
    const apiKeys = await this.userService.getApiKeys(req.user.userId);

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
      await this.userService.deleteApiKey(req.user.userId, apiKeyId);
    } catch (e) {
      if (e instanceof ApiKeyNotFoundError) {
        console.log('asd');
        throw new ApiKeyNotFoundException();
      }
    }
  }

  @Get('/test')
  @UseGuards(ApiKeyAuthGuard)
  async test(@Req() req: any) {
    console.log(req.user);
    return '123123';
  }
}

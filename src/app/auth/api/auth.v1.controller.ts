import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignInRequest, SignUpRequest } from '../dto/auth.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenResponse } from '../dto/token.dto';
import {
  UserNotFoundError,
  UserNotFoundException,
} from 'src/common/errors/user.error';
import {
  DuplicatedEmailError,
  DuplicatedEmailException,
  InvalidPasswordError,
  InvalidPasswordException,
} from 'src/common/errors/auth.error';

@ApiTags('인증')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @ApiOperation({
    operationId: '회원가입',
    summary: '회원가입',
    description: '회원 가입을 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/signUp')
  @ApiOkResponse({ type: TokenResponse })
  async signUp(@Body() body: SignUpRequest): Promise<TokenResponse> {
    try {
      const token = await this.authService.signUp(body);
      return token;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof DuplicatedEmailError) {
        throw new DuplicatedEmailException();
      }

      throw new InternalServerErrorException(e);
    }
  }

  @ApiOperation({
    operationId: '로그인',
    summary: '로그인',
    description: '로그인을 요청합니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/signIn')
  @ApiOkResponse({ type: TokenResponse })
  async signIn(@Body() body: SignInRequest): Promise<TokenResponse> {
    try {
      const token = await this.authService.signIn(body);
      return token;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof UserNotFoundError) {
        throw new UserNotFoundException();
      }

      if (e instanceof InvalidPasswordError) {
        throw new InvalidPasswordException();
      }

      throw new InternalServerErrorException(e);
    }
  }
}

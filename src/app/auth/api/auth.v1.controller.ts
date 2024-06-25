import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignInRequest, SignUpRequest } from '../dto/auth.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TokenResponse } from '../dto/token.dto';
import { randomUUID } from 'crypto';

@ApiTags("인증")
@Controller({path : "auth" , version : "1"})
export class AuthController {
    constructor(
        private readonly authService : AuthService
    ){ }

    @ApiOperation({
        operationId: '회원가입',
        summary: '회원가입',
        description: '회원 가입을 요청합니다.'
    })
    @HttpCode(HttpStatus.OK)
    @Post("/signUp")
    @ApiOkResponse({ type : TokenResponse })
    async signUp(@Body() body :SignUpRequest): Promise<TokenResponse>{
        return this.authService.signUp(body);
    }

    @ApiOperation({
        operationId: '로그인',
        summary: '로그인',
        description: '로그인을 요청합니다.'
    })
    @HttpCode(HttpStatus.OK)
    @Post("/signIn")
    @ApiOkResponse({ type : TokenResponse })
    async signIn(@Body() body :SignInRequest): Promise<TokenResponse> {
        return this.authService.signIn(body);
    }

    @Get("")
    @UseGuards(AuthGuard("jwt"))
    async test(@Req() req : any) {
        console.log(req.user.userId)
        return "11"
    }
}

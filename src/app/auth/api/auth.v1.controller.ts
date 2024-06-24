import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignInRequest, SignUpRequest } from '../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { access } from 'fs';
import { JwtAccessStrategy } from '../strategy/jwt.access.strategy';
import { AuthGuard } from '@nestjs/passport';
import { TokenResponse } from '../dto/token.dto';
import { JwtAuthGuard } from '../strategy/jwt.guard';

@ApiTags("인증")
@Controller({path : "auth" , version : "1"})
export class AuthController {
    constructor(
        private readonly authService : AuthService
    ){ }

    @Post("/signUp")
    signUp(@Body() body :SignUpRequest): Promise<TokenResponse>{
        return this.authService.signUp(body);
    }

    @Post("/signIn")
    signIn(@Body() body :SignInRequest): Promise<TokenResponse> {
        return this.authService.signIn(body);
    }

    @Get("")
    @UseGuards(AuthGuard("jwt"))
    test() {
        return "11"
    }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpRequest } from '../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("인증")
@Controller({path : "auth" , version : "1"})
export class AuthController {
    constructor(
        private readonly authService : AuthService
    ){ }

    @Post()
    signUp(@Body() body :SignUpRequest): void {
        this.authService.signUp(body)
    }

    @Get("/")
    signIn(): void {
        console.log("sss")
    }
}

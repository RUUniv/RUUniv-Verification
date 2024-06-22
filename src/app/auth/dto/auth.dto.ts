import { Options } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';



export class SignUpRequest{

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}
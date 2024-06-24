import { Options } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 *  Request
 */

export class SignUpRequest{

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}

export class SignInRequest{
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

/**
 * Response
 */
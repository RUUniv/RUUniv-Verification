import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import * as bcrypt from 'bcrypt'
import { SignUpRequest } from '../dto/auth.dto';
import { ApiOperation } from '@nestjs/swagger';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }
    
    
    async signUp(data: SignUpRequest) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        await this.databaseService.user.create({
            data: {
                email: data.email,
                password : hashedPassword
            }
        })

    }

}
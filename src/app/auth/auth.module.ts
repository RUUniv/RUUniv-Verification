import { Module, ValidationPipe } from '@nestjs/common';
import { AuthController } from './api/auth.v1.controller';
import { AuthService } from './service/auth.service';
import { APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from 'src/infrastructure/database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService,],
  exports: [AuthService],
})
export class AuthModule {}

import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/service/auth.service';
import { StudentModule } from './student/student.module';


@Module({
  imports: [UserModule, AuthModule, StudentModule],
  controllers: [AppController],
  
})
export class AppModule {}

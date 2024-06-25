import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [UserModule, AuthModule, StudentModule],
  controllers: [AppController],
})
export class AppModule {}

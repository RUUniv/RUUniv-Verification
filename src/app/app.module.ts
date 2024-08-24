import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VerificationModule } from './verification/verification.module';
import { KeyModule } from './keys/key.module';

@Module({
  imports: [UserModule, AuthModule, VerificationModule, KeyModule],
  controllers: [AppController],
})
export class AppModule {}

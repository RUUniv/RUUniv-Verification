import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.v1.controller';
import { AuthService } from './service/auth.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategy/jwt.access.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({ global: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}

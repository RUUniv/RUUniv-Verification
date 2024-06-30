import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import * as bcrypt from 'bcrypt';
import { SignInRequest, SignUpRequest } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { TokenResponse } from '../dto/token.dto';
import { UserNotFoundError } from 'src/common/errors/user.error';
import {
  DuplicatedEmailError,
  InvalidPasswordError,
} from 'src/common/errors/auth.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async signUp(data: SignUpRequest): Promise<TokenResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    if (await this.isDuplicatedEmail(data.email)) {
      throw new DuplicatedEmailError();
    }

    const user = await this.databaseService.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    const [accessToken, refreshToken] = await this.reissueToken(user);

    this.logger.log(`[SignUp] : ${data.email}`);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signIn(data: SignInRequest): Promise<TokenResponse> {
    const user = await this.databaseService.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    if (!bcrypt.compareSync(data.password, user.password)) {
      throw new InvalidPasswordError();
    }

    this.logger.log(`[SignIn] : ${data.email}`);

    const [accessToken, refreshToken] = await this.reissueToken(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  // todo : redis를 통한 refresh 구현 필요
  async refresh(refreshToken: string): Promise<TokenResponse> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    }) as User;

    const user = await this.databaseService.user.findUnique({
      where: { id: payload.id },
    });

    const [accessToken, newRefreshToken] = await this.reissueToken(user);

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async reissueToken(user: User): Promise<[string, string]> {
    return Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user),
    ]);
  }

  private async createAccessToken(user: User): Promise<string> {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const access_token = this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: parseInt(
        this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
      ),
    });

    return access_token;
  }

  private async createRefreshToken(user: User): Promise<string> {
    const payload = {
      userId: user.id,
    };
    const refresh_token = this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: parseInt(
        this.configService.get<string>('JWT_REFRESH_TOKEN_EXP'),
      ),
    });

    return refresh_token;
  }

  private async isDuplicatedEmail(email: string): Promise<boolean> {
    const count = await this.databaseService.user.count({
      where: { email },
    });

    return count > 0;
  }
}

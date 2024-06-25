import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  //NestJS Docs
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload) {
    req.user = payload.id;

    return payload;
  }
}

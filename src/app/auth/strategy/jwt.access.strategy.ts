import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../service/auth.service";

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    //NestJS Docs
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,

    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Request Header에서 Bearer auth 뽑아내기
            secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            // 만료된 토큰은 거부
            ignoreExpiration: false,
            // validate 함수에 첫번째 인자에 request를 넘겨줌
            passReqToCallback: true
        });
    }

    
    validate(payload) {
        return {
            email: payload.email,
            id: payload.id,
        };
    }
}

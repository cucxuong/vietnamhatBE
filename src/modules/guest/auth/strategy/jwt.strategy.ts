import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from 'src/modules/common/config/config.service';
import { AuthService } from '../auth.service';
import { getTokenFromaReqHeaders } from '../utils/helpers';
import { TokenPayload } from '../utils/type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: getTokenFromaReqHeaders,
      ignoreExpiration: false,
      secretOrKey: configService.get().jwt.access_secret_key,
    });
  }

  async validate(payload: TokenPayload) {
    return this.authService.validateUser(payload);
  }
}

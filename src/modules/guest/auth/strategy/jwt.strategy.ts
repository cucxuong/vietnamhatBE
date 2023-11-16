import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ConfigService } from 'src/modules/common/config/config.service';
import { AuthService } from '../auth.service';
import { TokenPayload } from '../utils/type';

export const getToken = (req: Request) => {
  const token = req.headers.authorization
    ?.replace('Bearer', '')
    ?.replace('bearer', '')
    ?.trim();

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: getToken,
      ignoreExpiration: false,
      secretOrKey: configService.get().jwt.access_secret_key,
    });
  }

  async validate(payload: TokenPayload) {
    return this.authService.validateUser(payload);
  }
}

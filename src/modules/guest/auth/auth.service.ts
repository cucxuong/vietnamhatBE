import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';
import { User } from 'src/modules/admin/users/schemas/user.schema';
import { ConfigService } from 'src/modules/common/config/config.service';
import { RefreshTokenService } from '../refresh_token/refresh.token.service';
import { LoginDto } from './dto/auth.dto';
import { LoggedUser, TokenPayload, TokenType } from './utils/type';

@Injectable()
export class AuthService {
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpireTime: string;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
    this.refreshTokenSecret = this.configService.get().auth.refresh_secret_key;
    this.refreshTokenExpireTime =
      this.configService.get().auth.refresh_expire_time;
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({ email: body.email });

    if (!user) {
      throw new NotFoundException('Invalid Credentials');
    }

    const checkPassword = argon2.verify(user.password, body.password);

    if (!checkPassword) {
      throw new NotFoundException('Invalid Credentials');
    }

    const payload: Omit<TokenPayload, 'type'> = {
      email: body.email.trim().toLowerCase(),
      id: user.id,
      role: user.role,
    };

    // gen token
    const access_token = this.genAccessToken(payload);
    const refresh_token = this.genRefreshToken(payload);

    // Store Refresh Token
    await this.refreshTokenService.storeToken({ token: refresh_token, user });

    return {
      name: user.name,
      email: user.email.trim().toLowerCase(),
      id: user.id,
      access_token,
      refresh_token,
      role: user.role,
    };
  }

  async validateUser({ id, email }: TokenPayload): Promise<LoggedUser> {
    const user = await this.userModel.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id,
      role: user.role,
      email: user.email.trim().toLowerCase(),
    };
  }

  genAccessToken(payload: Omit<TokenPayload, 'type'>) {
    return this.jwtService.sign({ ...payload, type: TokenType.access });
  }

  genRefreshToken(payload: Omit<TokenPayload, 'type'>) {
    return this.jwtService.sign(
      { ...payload, type: TokenType.refresh },
      {
        secret: this.refreshTokenSecret,
        expiresIn: this.refreshTokenExpireTime,
      },
    );
  }
}

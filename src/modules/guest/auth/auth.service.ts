import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { User } from 'src/modules/admin/users/schemas/user.schema';
import { ConfigService } from 'src/modules/common/config/config.service';
import { LoginDto } from './dto/auth.dto';
import { LoginData } from './res/login.res';
import { RefreshToken } from './schema/refresh.token.schema';
import { TokenType } from './utils/const';
import { AuthedUser, TokenPayload } from './utils/type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(body: LoginDto): Promise<LoginData> {
    const user = await this.userModel.findOne({
      email: body.email,
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const checkPassword = argon.verify(user.password, body.password);

    if (!checkPassword) {
      throw new BadRequestException('Credential is invalid');
    }

    const payload: Omit<TokenPayload, 'type'> = {
      id: user.id,
      email: user.email,
    };

    const accessToken = await this.genAccessToken(payload);
    const refreshToken = await this.genRefreshToken(payload);

    await this.refreshTokenModel.create({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user,
    });

    return new LoginData({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async logout(user: AuthedUser, token: string): Promise<void> {
    const refreshItem = await this.refreshTokenModel.findOne({
      user: user.id,
      access_token: token,
    });

    if (!refreshItem) {
      throw new BadRequestException('Invalid Token');
    }

    await this.refreshTokenModel.findByIdAndDelete(refreshItem.id);
  }

  async refreshToken({ token }: { token: string }) {
    try {
      const oldPayload: TokenPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get().jwt.refresh_secret_key,
        },
      );

      const user = await this.userModel.findById(oldPayload.id);

      if (!user) {
        throw new BadRequestException('Invalid Token');
      }

      const oldRefreshToken = await this.refreshTokenModel.findOne({
        refresh_token: token,
        user,
      });

      if (!oldRefreshToken) {
        throw new BadRequestException('Invalid Token');
      }

      const newPayload: Omit<TokenPayload, 'type'> = {
        id: user.id,
        email: user.email,
      };

      const accessToken = await this.genAccessToken(newPayload);
      const newRefreshToken = await this.genRefreshToken(newPayload);

      await this.refreshTokenModel.create({
        access_token: accessToken,
        refresh_token: newRefreshToken,
        user: user,
      });

      await this.refreshTokenModel.findByIdAndDelete(oldRefreshToken.id);

      return new LoginData({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        access_token: accessToken,
        refresh_token: newRefreshToken,
      });
    } catch (error) {
      throw error;
    }
  }

  async genAccessToken(payload: Omit<TokenPayload, 'type'>) {
    return await this.jwtService.sign({
      ...payload,
      type: TokenType.access,
    });
  }

  async genRefreshToken(payload: Omit<TokenPayload, 'type'>) {
    return await this.jwtService.sign(
      { ...payload, type: TokenType.refresh },
      {
        secret: this.configService.get().jwt.refresh_secret_key,
        expiresIn: this.configService.get().jwt.refresh_token_expire_time,
      },
    );
  }

  async validateUser({ id, email }: TokenPayload): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user || user.email !== email) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

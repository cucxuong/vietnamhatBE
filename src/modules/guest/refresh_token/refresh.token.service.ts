import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/admin/users/schemas/user.schema';
import { RefreshToken } from './schema/refresh.token.schema';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}

  async storeToken({ token, user }: { user: User; token: string }) {
    return await this.refreshTokenModel.create({
      token,
      user,
    });
  }
}

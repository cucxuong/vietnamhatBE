import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/admin/users/schemas/user.schema';
import { ConfigModule } from 'src/modules/common/config/config.module';
import { ConfigService } from 'src/modules/common/config/config.service';
import { RefreshTokenModule } from '../refresh_token/refresh.token.module';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../refresh_token/schema/refresh.token.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guard/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    RefreshTokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get().auth.access_secret_key,
          signOptions: {
            expiresIn: configService.get().auth.access_expire_time,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

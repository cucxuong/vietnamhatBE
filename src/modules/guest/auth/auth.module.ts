import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/admin/users/schemas/user.schema';
import { ConfigModule } from 'src/modules/common/config/config.module';
import { ConfigService } from 'src/modules/common/config/config.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schema/refresh.token.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get().jwt.access_secret_key,
          signOptions: { expiresIn: configService.get().jwt.token_expire_time },
        };
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

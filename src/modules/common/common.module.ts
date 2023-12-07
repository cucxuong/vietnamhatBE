import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { RefreshTokenModule } from './refresh_token/refresh.token.module';

@Module({
  imports: [AuthModule, MailModule, RefreshTokenModule],
  controllers: [],
  providers: [],
})
export class CommonModule {}

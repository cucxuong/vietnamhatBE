import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    protected readonly configService: ConfigService,
  ) {}

  async sendMail(mailOptions: ISendMailOptions) {
    await this.mailerService.sendMail(mailOptions);
  }
}

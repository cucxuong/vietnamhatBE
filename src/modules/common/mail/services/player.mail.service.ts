import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { formatCurrency } from 'src/common/utils/helper';
import { Currency } from 'src/common/utils/type';
import { PlayerDocument } from 'src/modules/admin/player/schema/player.schema';
import { calculateDetailFee } from 'src/modules/admin/player/utils/helper';
import { Country } from 'src/modules/admin/tournament/utils/type';
import { MailService } from '../mail.service';

@Injectable()
export class PlayerMailService extends MailService {
  async sendRegisterEmail(player: PlayerDocument) {
    let subject = '';
    if (this.configService.get().app.env !== 'production') {
      subject += `[${this.configService.get().app.env}] `;
    }
    subject += '[Vietnam HAT 2023] Register Info';

    const detailFee = calculateDetailFee(player);

    this.sendMail({
      to: player.email,
      subject,
      template: './player/register',
      context: {
        full_name: player.name,
        player_code: player.code,
        total_fee: formatCurrency(detailFee.totalFee, Currency.Vietnam),
        exchange_rate: formatCurrency(
          detailFee.exchangeRate,
          detailFee.currency,
        ),
        total_foreign: formatCurrency(
          detailFee.totalForeign,
          detailFee.currency,
        ),
        base_price: formatCurrency(detailFee.detail.base, Currency.Vietnam),
        lunch: detailFee.detail.lunch
          ? formatCurrency(detailFee.detail.lunch, Currency.Vietnam)
          : '',
        bus: detailFee.detail.bus
          ? formatCurrency(detailFee.detail.bus, Currency.Vietnam)
          : '',
        staying_country: player.country,
        jerseys_price: detailFee.detail.jerseys.price
          ? formatCurrency(detailFee.detail.jerseys.price, Currency.Vietnam)
          : '',
        jerseys_black_count: detailFee.detail.jerseys.black.length,
        jerseys_black_str: detailFee.detail.jerseys.black.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        jerseys_white_count: detailFee.detail.jerseys.white.length,
        jerseys_white_str: detailFee.detail.jerseys.white.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        shorts_price: detailFee.detail.shorts.price
          ? formatCurrency(detailFee.detail.shorts.price, Currency.Vietnam)
          : '',
        shorts_black_count: detailFee.detail.shorts.black.length,
        shorts_black_str: detailFee.detail.shorts.black.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        shorts_white_count: detailFee.detail.shorts.white.length,
        shorts_white_str: detailFee.detail.shorts.white.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        currency: detailFee.currency,
        disc_count: detailFee.detail.disc.quantity,
        disc_price: formatCurrency(
          detailFee.detail.disc.price,
          Currency.Vietnam,
        ),
        is_vietnam: player.country === Country.Vietnam,
        is_philippines: player.country === Country.Philipines,
        is_malaysia: player.country === Country.Malaysia,
        is_singapore: player.country === Country.Singapore,
        is_cambodia: player.country === Country.Cambodia,
        other_country: Object.values(Country).includes(
          player.country as unknown as Country,
        ),
        is_student: player.is_student,
        detail_fee: detailFee.detail,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/..//templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
  }

  async sendReminderMail({
    player,
  }: {
    player: PlayerDocument;
  }): Promise<void> {
    let subject = '';
    if (this.configService.get().app.env !== 'production') {
      subject += `[${this.configService.get().app.env}] `;
    }
    subject += '[VNHat 2023] Payment Reminder';

    const detailFee = calculateDetailFee(player);

    this.sendMail({
      to: player.email,
      subject,
      template: './player/reminder',
      context: {
        registration_date: format(player.created_at, 'yyyy-MM-dd'),
        full_name: player.name,
        player_code: player.code,
        total_fee: formatCurrency(detailFee.totalFee, Currency.Vietnam),
        exchange_rate: formatCurrency(
          detailFee.exchangeRate,
          detailFee.currency,
        ),
        total_foreign: formatCurrency(
          detailFee.totalForeign,
          detailFee.currency,
        ),
        base_price: formatCurrency(detailFee.detail.base, Currency.Vietnam),
        lunch: detailFee.detail.lunch
          ? formatCurrency(detailFee.detail.lunch, Currency.Vietnam)
          : '',
        bus: detailFee.detail.bus
          ? formatCurrency(detailFee.detail.bus, Currency.Vietnam)
          : '',
        staying_country: player.country,
        jerseys_price: detailFee.detail.jerseys.price
          ? formatCurrency(detailFee.detail.jerseys.price, Currency.Vietnam)
          : '',
        jerseys_black_count: detailFee.detail.jerseys.black.length,
        jerseys_black_str: detailFee.detail.jerseys.black.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        jerseys_white_count: detailFee.detail.jerseys.white.length,
        jerseys_white_str: detailFee.detail.jerseys.white.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        shorts_price: detailFee.detail.shorts.price
          ? formatCurrency(detailFee.detail.shorts.price, Currency.Vietnam)
          : '',
        shorts_black_count: detailFee.detail.shorts.black.length,
        shorts_black_str: detailFee.detail.shorts.black.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        shorts_white_count: detailFee.detail.shorts.white.length,
        shorts_white_str: detailFee.detail.shorts.white.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        currency: detailFee.currency,
        disc_count: detailFee.detail.disc.quantity,
        disc_price: formatCurrency(
          detailFee.detail.disc.price,
          Currency.Vietnam,
        ),
        is_vietnam: player.country === Country.Vietnam,
        is_philippines: player.country === Country.Philipines,
        is_malaysia: player.country === Country.Malaysia,
        is_singapore: player.country === Country.Singapore,
        is_cambodia: player.country === Country.Cambodia,
        other_country: Object.values(Country).includes(
          player.country as unknown as Country,
        ),
        is_student: player.is_student,
        detail_fee: detailFee.detail,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/..//templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
  }

  async sendPaymentMail({ player }: { player: PlayerDocument }) {
    let subject = '';
    if (this.configService.get().app.env !== 'production') {
      subject += `[${this.configService.get().app.env}] `;
    }
    subject += '[VNHat 2023] Payment Received Confirmation';

    const detailFee = calculateDetailFee(player);

    this.sendMail({
      to: player.email,
      subject,
      template: './player/payment_received',
      context: {
        full_name: player.name,
        player_code: player.code,
        status_label: player.status.toUpperCase(),
        total_fee: formatCurrency(detailFee.totalFee, Currency.Vietnam),
        exchange_rate: formatCurrency(
          detailFee.exchangeRate,
          detailFee.currency,
        ),
        total_foreign: formatCurrency(
          detailFee.totalForeign,
          detailFee.currency,
        ),
        base_price: formatCurrency(detailFee.detail.base, Currency.Vietnam),
        lunch: detailFee.detail.lunch
          ? formatCurrency(detailFee.detail.lunch, Currency.Vietnam)
          : '',
        bus: detailFee.detail.bus
          ? formatCurrency(detailFee.detail.bus, Currency.Vietnam)
          : '',
        staying_country: player.country,
        jerseys_price: detailFee.detail.jerseys.price
          ? formatCurrency(detailFee.detail.jerseys.price, Currency.Vietnam)
          : '',
        jerseys_black_count: detailFee.detail.jerseys.black.length,
        jerseys_black_str: detailFee.detail.jerseys.black.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        jerseys_white_count: detailFee.detail.jerseys.white.length,
        jerseys_white_str: detailFee.detail.jerseys.white.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        shorts_price: detailFee.detail.shorts.price
          ? formatCurrency(detailFee.detail.shorts.price, Currency.Vietnam)
          : '',
        shorts_black_count: detailFee.detail.shorts.black.length,
        shorts_black_str: detailFee.detail.shorts.black.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        shorts_white_count: detailFee.detail.shorts.white.length,
        shorts_white_str: detailFee.detail.shorts.white.reduce(
          (result, item) => {
            if (result !== '') {
              result += ', ';
            }
            result += item.size.toUpperCase() + 'x' + item.quantity;

            return result;
          },
          '',
        ),
        currency: detailFee.currency,
        disc_count: detailFee.detail.disc.quantity,
        disc_price: formatCurrency(
          detailFee.detail.disc.price,
          Currency.Vietnam,
        ),
        is_vietnam: player.country === Country.Vietnam,
        is_philippines: player.country === Country.Philipines,
        is_malaysia: player.country === Country.Malaysia,
        is_singapore: player.country === Country.Singapore,
        is_cambodia: player.country === Country.Cambodia,
        other_country: Object.values(Country).includes(
          player.country as unknown as Country,
        ),
        is_student: player.is_student,
        detail_fee: detailFee.detail,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/..//templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
  }
}

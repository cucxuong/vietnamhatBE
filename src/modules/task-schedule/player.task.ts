import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { compareAsc, endOfDay, parseISO, startOfDay, subDays } from 'date-fns';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '../admin/player/schema/player.schema';
import { PlayerStatus } from '../admin/player/utils/type';
import { ConfigService } from '../common/config/config.service';
import { PlayerMailService } from '../common/mail/services/player.mail.service';

@Injectable()
export class PlayerTaskService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
    private readonly configService: ConfigService,
    private readonly playerMailService: PlayerMailService,
  ) {}

  @Cron('*/5 * * * * *', {
    name: 'VNHAT_Player_Payment_Reminder',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async tournamentPlayerPaymentReminder() {
    console.log('====== REMINDER PAYMENT =======');
    let condition: any[] = [];
    let day7Before = subDays(new Date(), 7);

    while (compareAsc(day7Before, parseISO('2023-10-30T00:00:00')) !== -1) {
      condition = [
        ...condition,
        {
          created_at: {
            $gte: startOfDay(day7Before),
            $lte: endOfDay(day7Before),
          },
        },
      ];

      day7Before = subDays(day7Before, 7);
    }

    const reminderPlayers: PlayerDocument[] = await this.playerModel
      .find({
        status: PlayerStatus.Pending,
        $or: condition,
      })
      .exec();

    if (reminderPlayers.length) {
      for (const player of reminderPlayers) {
        await this.playerMailService.sendReminderMail({ player });
      }
    }
  }
}

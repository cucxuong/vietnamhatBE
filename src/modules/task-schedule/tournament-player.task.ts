import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import {
  compareAsc,
  endOfDay,
  format,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns';
import { Model } from 'mongoose';
import {
  TournamentPlayer,
  TournamentPlayerDocument,
} from '../../schemas/tournament-player.schema';
import { TOURNAMENT_PLAYER_STATUS } from '../../utils/tournament.player.const';
import { ConfigService } from '../common/config/config.service';
import { MailService } from '../common/mail/mail.service';
import { TournamentPlayerService } from '../guest/tournament_players/tournament-players.service';
import { TournamentService } from '../guest/tournaments/tournaments.service';

@Injectable()
export class TournamentPlayerTask {
  constructor(
    @InjectModel(TournamentPlayer.name)
    private readonly tournamentPlayerModel: Model<TournamentPlayerDocument>,
    private readonly tournamentService: TournamentService,
    private readonly tournamentPlayerService: TournamentPlayerService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  // @Cron('0 0 * * *', {
  //   name: "VNHAT_Player_Payment_Reminder",
  //   timeZone: 'Asia/Ho_Chi_Minh'
  // })
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

    const reminderPlayers: TournamentPlayerDocument[] =
      await this.tournamentPlayerModel
        .find({
          tournament: this.configService.get().vnhat2023.tournament_id,
          status: TOURNAMENT_PLAYER_STATUS.PENDING,
          $or: condition,
        })
        .exec();

    console.log(reminderPlayers);

    if (reminderPlayers.length) {
      const tournament = await this.tournamentService.getDetailInfo(
        this.configService.get().vnhat2023.tournament_id,
      );

      for (const player of reminderPlayers) {
        const { totalFee, totalForeign, detailFee, currency, isVietnam } =
          this.tournamentPlayerService.calculateDetailFee(player, tournament);

        let subject = '';
        if (this.configService.get().app.env !== 'production') {
          subject += `[${this.configService.get().app.env}] `;
        }
        subject += '[VNHat 2023] Payment Reminder';

        await this.mailService.sendMail({
          to: player.email,
          subject,
          template: `./tournament-players/reminders`,
          context: {
            player_name: player.full_name,
            // @ts-ignore
            registration_date: format(player.created_at, 'yyyy-MM-dd'),
            player_code: player.player_code,
            total_fee: totalFee,
            total_foreign: totalForeign,
            is_vietnam: isVietnam,
            currency: currency,
            detail_fee: detailFee,
          },
        });
      }
    }
  }

//  @Cron('*/5 * * * *', {
//    name: 'VNHAT_Player_Ticket',
//    timeZone: 'Asia/Ho_Chi_Minh',
//  })
  async sendTicket() {
    let player = await this.tournamentPlayerModel.findOne({
      status: { $ne: TOURNAMENT_PLAYER_STATUS.CANCELLED },
      send_ticket: { $ne: true },
    });

    if (!player) {
      console.log('==== SEND TICKET PLAYER FINISHED =====');
      return;
    }

    const { addition } = JSON.parse(player.selected_options);
    const { lunch, bus } = addition;

    console.log('----- PLAYER TICKET -------');
    console.log(Date.now().toString());
    console.log(player.full_name);
    console.log(player.player_code);
    console.log(player.status);
    console.log(lunch);
    console.log(lunch ? 'Have lunch' : 'No lunch');
    console.log(bus);
    console.log(bus ? 'Have bus' : 'No bus');

    if (lunch || bus) {
      console.log("===== SEND MAIl ====");

      await this.mailService.sendMail({
        to: player.email,
        subject: '[VNHat 2023] Lunch and Bus E-Tickets',
        template: './ticket',
        context: {
          player_name: player.full_name,
          player_code: player.player_code,
          lunch,
          bus,
        },
        attachments: [
          {
            filename: 'bus.png',
            path: `${__dirname}/../common/mail/templates/images/bus.png`,
            cid: 'bus',
          },
          {
            filename: 'lunch.png',
            path: `${__dirname}/../common/mail/templates/images/lunch.png`,
            cid: 'lunch',
          },
        ],
      });
    } else {
      console.log("==== NOT SEND MAIL =====");
    }
    await this.tournamentPlayerModel.updateOne(
      { player_code: player.player_code },
      { send_ticket: true },
    );
  }
}

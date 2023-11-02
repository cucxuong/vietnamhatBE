import {Injectable, Logger, Scope} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {TournamentPlayer, TournamentPlayerDocument} from "../../schemas/tournament-player.schema";
import mongoose, {Model, mongo} from "mongoose";
import {Cron} from "@nestjs/schedule";
import {format, parseISO, startOfDay, subDays} from "date-fns";
import {MailService} from "../../common/modules/mail/mail.service";
import {TournamentService} from "../guest/tournaments/tournaments.service";
import {ConfigService} from "@nestjs/config";
import {TournamentPlayerService} from "../guest/tournament_players/tournament-players.service";

@Injectable()
export class TournamentPlayerTask {
  constructor(
    @InjectModel(TournamentPlayer.name)
    private readonly tournamentPlayerModel: Model<TournamentPlayerDocument>,
    private readonly tournamentService: TournamentService,
    private readonly tournamentPlayerService: TournamentPlayerService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
  }

  @Cron('0 0 * * *', {
    name: "VNHAT_Player_Payment_Reminder",
    timeZone: 'Asia/Ho_Chi_Minh'
  })
  async tournamentPlayerPaymentReminder() {
    console.log('====== REMINDER PAYMENT =======');
    const day7Before = startOfDay(subDays(startOfDay(new Date()), 7));

    const reminderPlayers: TournamentPlayerDocument[] = await this.tournamentPlayerModel.find({
      tournament: this.configService.get<string>('VIETNAM_HAT_2023_TOURNAMENT_ID'),
      status: 'pending',
      created_at: {
        $lt: day7Before,
      }
    }).exec();

    console.log(reminderPlayers);

    if (reminderPlayers.length) {
      const tournament = await this.tournamentService.getDetailInfo(
        this.configService.get<string>('VIETNAM_HAT_2023_TOURNAMENT_ID')!
      );

      for (const player of reminderPlayers) {
        const {
          totalFee,
          totalForeign,
          detailFee,
          currency,
          isVietnam
        } = this.tournamentPlayerService.calculateDetailFee(player, tournament);

        let subject = '';
        if (this.configService.get<string>('APP_ENV') !== 'production') {
          subject += `[${this.configService.get<string>("APP_ENV")}] `;
        }
        subject += '[VNHat 2023] Payment Reminder';

        await this.mailService.sendMail({
          to: player.email,
          subject,
          template: `./tournament-players/reminders`,
          context: {
            player_name: player.full_name,
            // @ts-ignore
            registration_date: format(player.created_at, "yyyy-MM-dd"),
            player_code: player.player_code,
            total_fee: totalFee,
            total_foreign: totalForeign,
            is_vietnam: isVietnam,
            currency: currency,
            detail_fee: detailFee,
          }
        })
      }
    }
  }

  @Cron('1 * * * *', {
    name: "VNHAT_Player_Payment_Expired",
    timeZone: 'Asia/Ho_Chi_Minh'
  })
  async tournamentPlayerExpired() {
    const day8Before = startOfDay(subDays(startOfDay(new Date()), 8));
    const filter = {
      tournament: this.configService.get<string>('VIETNAM_HAT_2023_TOURNAMENT_ID'),
      status: 'pending',
      created_at: {
        $lt: day8Before,
      }
    };

    const expiredPlayers: TournamentPlayerDocument[] = await this.tournamentPlayerModel.find(filter).exec();

    if (expiredPlayers.length) {
      await this.tournamentPlayerModel.updateMany(filter, {
        status: 'expired',
      });
    }
  }
}

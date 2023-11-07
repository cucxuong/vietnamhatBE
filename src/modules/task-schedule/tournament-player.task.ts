import { Injectable, Logger, Scope } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TournamentPlayer, TournamentPlayerDocument } from "../../schemas/tournament-player.schema";
import mongoose, { Model, mongo } from "mongoose";
import { Cron } from "@nestjs/schedule";
import { compareAsc, endOfDay, format, parseISO, startOfDay, subDays } from "date-fns";
import { MailService } from "../../common/modules/mail/mail.service";
import { TournamentService } from "../guest/tournaments/tournaments.service";
import { ConfigService } from "@nestjs/config";
import { TournamentPlayerService } from "../guest/tournament_players/tournament-players.service";
import { TOURNAMENT_PLAYER_STATUS } from "../../utils/tournament.player.const";

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
    let condition: any[] = [];
    let day7Before = subDays(new Date(), 7);

    while (compareAsc(day7Before, parseISO('2023-10-30T00:00:00')) !== -1) {
      condition = [
        ...condition,
        {
          created_at: {
            $lte: startOfDay(day7Before),
            $gt: endOfDay(day7Before),
          },
        }
      ];

      day7Before = subDays(day7Before, 7);
    }

    const reminderPlayers: TournamentPlayerDocument[] = await this.tournamentPlayerModel.find({
      tournament: this.configService.get<string>('VIETNAM_HAT_2023_TOURNAMENT_ID'),
      status: TOURNAMENT_PLAYER_STATUS.PENDING,
      $or: condition
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
}

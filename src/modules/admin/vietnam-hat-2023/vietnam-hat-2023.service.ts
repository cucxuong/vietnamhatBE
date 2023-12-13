import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from 'src/modules/common/config/config.service';
import {
  TournamentPlayer,
  TournamentPlayerDocument,
} from '../../../schemas/tournament-player.schema';
import { TOURNAMENT_PLAYER_STATUS } from '../../../utils/tournament.player.const';
import { MailService } from '../../common/mail/mail.service';
import { TournamentPlayerService } from '../../guest/tournament_players/tournament-players.service';
import { TournamentService } from '../../guest/tournaments/tournaments.service';

export class VietnamHat2023Service {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(TournamentPlayer.name)
    private readonly tournamentPlayerModel: Model<TournamentPlayerDocument>,
    private readonly tournamentService: TournamentService,
    private readonly tournamentPlayerService: TournamentPlayerService,
    private mailService: MailService,
  ) {}

  async getPlayerList({ country }: { country: string | null }) {
    const tournamentId = this.config.get().vnhat2023.tournament_id;

    let condition: any = { tournament: tournamentId };
    if (country) {
      condition = { ...condition, current_country: country };
    }

    const players = await this.tournamentPlayerModel
      .find(condition)
      .sort({ status: -1, created_at: -1 })
      .exec();

    const tournament = await this.tournamentService.getDetailInfo(
      tournamentId!,
    );

    return players.map((player: any) => {
      const { totalFee } = this.tournamentPlayerService.calculateDetailFee(
        player,
        tournament,
      );

      return {
        ...player.toJSON(),
        total_fee: totalFee,
      };
    });
  }

  async updatePaymentStatus({
    player_code,
    status = TOURNAMENT_PLAYER_STATUS.PAID,
  }: {
    player_code: string;
    status: TOURNAMENT_PLAYER_STATUS;
  }) {
    const player: any = await this.tournamentPlayerModel.findOne({
      player_code,
    });

    if (player && player.status == 'pending') {
      await this.tournamentPlayerModel.findByIdAndUpdate(player.id, { status });

      const tournament = await this.tournamentService.getDetailInfo(
        player.tournament,
      );

      const { totalFee, totalForeign, detailFee, currency, isVietnam } =
        this.tournamentPlayerService.calculateDetailFee(player, tournament);

      let subject = '';
      if (this.config.get().app.env !== 'production') {
        subject += `[${this.config.get().app.env}] `;
      }
      subject += '[VNHat 2023] Payment Received Confirmation';

      this.mailService.sendMail({
        to: player.email,
        subject: subject,
        template: './tournament-players/payment_received',
        context: {
          is_vietnam: isVietnam,
          player_name: player.full_name,
          player_code: player.player_code,
          total_fee: Intl.NumberFormat().format(totalFee).replaceAll(',', "'"),
          total_foreign: Intl.NumberFormat()
            .format(totalForeign)
            .replaceAll(',', "'"),
          detail_fee: detailFee,
          currency: currency,
          status_label: status.toUpperCase(),
        },
      });
    }
  }

  async updatePlayerStatus({
    player_code,
    status,
  }: {
    player_code: string;
    status: string;
  }) {
    await this.tournamentPlayerModel.updateOne(
      {
        player_code,
      },
      { status },
    );
  }

  async updateNote({
    player_code,
    note,
  }: {
    player_code: string;
    note: string;
  }) {
    await this.tournamentPlayerModel.updateOne(
      {
        player_code,
      },
      { note },
    );
  }

  async run(): Promise<void> {
    const players = await this.tournamentPlayerModel.find({
      status: { $ne: TOURNAMENT_PLAYER_STATUS.CANCELLED },
      send_ticket: { $ne: true },
    });

    players.map((player) => {
      const { addition } = JSON.parse(player.selected_options);
      const { lunch, bus } = addition;

      console.log('----- PLAYER -------');
      console.log(player.full_name);
      console.log(player.player_code);
      console.log(player.status);
      console.log(lunch);
      console.log(lunch ? 'Have lunch' : 'No lunch');
      console.log(bus);
      console.log(bus ? 'Have bus' : 'No bus');
      
      // this.mailService.sendMail({
      //   to: player.email,
      //   subject: '[VNHat 2023] Lunch and Bus E-Tickets',
      //   template: './ticket',
      //   context: {
      //     player_name: player.full_name,
      //     player_code: player.player_code,
      //     lunch,
      //     bus,
      //   },
      //   attachments: [
      //     {
      //       filename: 'bus.png',
      //       path: `${__dirname}/../../common/mail/templates/images/bus.png`,
      //       cid: 'bus',
      //     },
      //     {
      //       filename: 'lunch.png',
      //       path: `${__dirname}/../../common/mail/templates/images/lunch.png`,
      //       cid: 'lunch',
      //     },
      //   ],
      // });
    });
  }
}

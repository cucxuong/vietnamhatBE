import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tournament, TournamentDocument } from 'src/schemas/tournament.schema';
import { TournamentPlayer, TournamentPlayerDocument } from "../../../schemas/tournament-player.schema";

export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)
    private readonly tournamentModel: Model<TournamentDocument>,
    @InjectModel(TournamentPlayer.name)
    private readonly tournamentPlayerModel: Model<TournamentPlayerDocument>,
  ) {
  }

  async getDetailInfo(id: string) {
    const tournament: TournamentDocument | null = await this.tournamentModel.findById(id);

    return {
      ...tournament?.toJSON(),
      options: tournament?.options ?? null,
      total_disc: await this.getTotalDiscInTournament({tournamentID: id}),
    };
  }

  async getTotalDiscInTournament({tournamentID}: { tournamentID: string }): Promise<number> {
    const players = await this.tournamentPlayerModel.find({
      $or: [
        {"status": 'pending'},
        {"status": 'paid',},
      ],
      "tournament": tournamentID,
    }).exec();

    // @ts-ignore
    return players.reduce((result: int, player: any) => {
      const {addition} = JSON.parse(player.selected_options);

      result += parseInt(addition?.disc) ?? 0;

      return result;
    }, 0);
  }
}

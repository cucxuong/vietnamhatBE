import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tournament, TournamentDocument } from 'src/schemas/tournament.schema';

export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)
    private readonly tournamentModel: Model<TournamentDocument>,
  ) {}

  async getDetailInfo(id: string) {
    const tournament = await this.tournamentModel.findById(id);

    return {
      ...tournament,
      options: tournament?.options ?? null,
    };
  }
}

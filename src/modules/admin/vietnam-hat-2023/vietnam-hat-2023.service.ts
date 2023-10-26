import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {
  TournamentPlayer,
  TournamentPlayerDocument,
} from '../../../schemas/tournament-player.schema';
import { Model } from 'mongoose';

export class VietnamHat2023Service {
  constructor(
    private readonly config: ConfigService,
    @InjectModel(TournamentPlayer.name)
    private readonly tournamentPlayerModel: Model<TournamentPlayerDocument>,
  ) {}
  async getPlayerList() {
    const tournamentId = this.config.get<string>('VIETNAM_HAT_2023_TOURNAMENT_ID');

    return await this.tournamentPlayerModel.find({ tournament: tournamentId }).exec();
  }
}

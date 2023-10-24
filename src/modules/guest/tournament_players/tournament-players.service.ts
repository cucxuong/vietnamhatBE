import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TournamentPlayer,
  TournamentPlayerDocument,
} from 'src/schemas/tournament-player.schema';
import { CreateTournamentPlayerDto } from './dto/create-tournament-player.dto';

export class TournamentPlayerService {
  constructor(
    @InjectModel(TournamentPlayer.name)
    private readonly tournamentPlayerModel: Model<TournamentPlayerDocument>,
  ) {}

  async create(
    createDto: CreateTournamentPlayerDto,
  ): Promise<TournamentPlayerDocument> {
    let playerCode = 0;
    let checkPlayerCode = null;

    do {
      playerCode = Math.floor(1000 + Math.random() * 9000);

      checkPlayerCode = await this.tournamentPlayerModel
        .findOne({
          player_code: playerCode,
        })
        .exec();
    } while (checkPlayerCode);

    const tournamentPlayer = new this.tournamentPlayerModel({
      ...createDto,
      status: 'pending',
      tournament: '653761306d34b11e8c3ccc0f',
      player_code: playerCode,
    });

    return tournamentPlayer.save();
  }
}

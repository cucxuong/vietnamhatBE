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
    const tournamentPlayer = new this.tournamentPlayerModel({
      ...createDto, 
      status: 'pending',
      tournament: '653761306d34b11e8c3ccc0f',
    });

    return tournamentPlayer.save();
  }
}

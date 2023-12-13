import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommandRunner } from 'nest-commander';
import { TournamentPlayer } from 'src/schemas/tournament-player.schema';
import { TOURNAMENT_PLAYER_STATUS } from 'src/utils/tournament.player.const';


export class BasicCommand extends CommandRunner {
  constructor(
    @InjectModel(TournamentPlayer.name)
    private readonly tournamePlayerModel: Model<TournamentPlayer>,
  ) {
    super();
  }

  async run(): Promise<void> {
    const players = await this.tournamePlayerModel.find({
      status: { $ne: TOURNAMENT_PLAYER_STATUS.PENDING },
    });

    players.map((player) => console.log(player.player_code));
  }
}

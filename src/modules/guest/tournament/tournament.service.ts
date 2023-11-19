import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    Player,
    PlayerDocument,
} from 'src/modules/admin/player/schema/player.schema';
import { MAX_DISCS } from 'src/modules/admin/tournament/utils/const';

export class TournamentService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
  ) {}

  async getRemainDiscs(): Promise<number> {
    const players = await this.playerModel
      .find({
        'services.disc.quantity': { $gt: 0 },
      })
      .exec();

    const result = players.reduce((result: number, player: PlayerDocument) => {
      result += player.services.disc.quantity;

      return result;
    }, 0);

    return MAX_DISCS - result;
  }
}

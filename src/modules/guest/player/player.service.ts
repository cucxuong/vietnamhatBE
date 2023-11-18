import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Player,
  PlayerDocument,
} from 'src/modules/admin/player/schema/player.schema';
import { CreatePlayerDto } from './dto/player.dto';

export class PlayerService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
  ) {}

  async store(body: CreatePlayerDto): Promise<PlayerDocument> {
    console.log(body);
    return await this.playerModel.create(body);
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<PlayerDocument> {
    const player = new this.playerModel(createPlayerDto);

    return player.save();
  }

  async findAll(): Promise<PlayerDocument[]> {
    return this.playerModel.find();
  }

  findOne(id: string) {
    return this.playerModel.findById(id);
  }

  async update(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<PlayerDocument | null> {
    return this.playerModel.findByIdAndUpdate(id, updatePlayerDto);
  }

  async remove(id: string) {
    return this.playerModel.findByIdAndRemove(id);
  }
}

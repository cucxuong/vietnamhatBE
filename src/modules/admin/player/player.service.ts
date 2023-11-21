import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerMailService } from 'src/modules/common/mail/services/player.mail.service';
import { Country } from '../country/utils/type';
import { Player, PlayerDocument } from './schema/player.schema';
import { PlayerStatus } from './utils/type';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
    private readonly playerMailService: PlayerMailService,
  ) {}

  async getPlayerList({
    country,
  }: {
    country: Country | null;
  }): Promise<PlayerDocument[]> {
    const conditions = country ? { country } : {};

    return await this.playerModel.find(conditions).exec();
  }

  async updatePlayerStatus({
    code,
    status,
  }: {
    code: string;
    status: PlayerStatus;
  }) {
    await this.playerModel.updateOne(
      {
        code,
      },
      { status },
    );
  }

  async updatePaymentStatus({
    code,
    status,
    country,
  }: {
    code: string;
    status: PlayerStatus.Halfpaid | PlayerStatus.Paid;
    country: Country;
  }): Promise<void> {
    if (country !== Country.Vietnam && status === PlayerStatus.Halfpaid) {
      throw new UnprocessableEntityException('Invalid Status');
    }

    let player = await this.playerModel
      .findOne({
        code,
        country,
      })
      .exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    await this.playerModel.updateOne({ code, country }, { status });

    player = await this.playerModel
      .findOne({
        code,
        country,
      })
      .exec();

      await this.playerMailService.sendPaymentMail({ player: player! });
  }
}

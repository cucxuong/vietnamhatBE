import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Player,
  PlayerDocument,
} from 'src/modules/admin/player/schema/player.schema';
import { PlayerStatus } from 'src/modules/admin/player/utils/type';
import { ServicePrice } from 'src/modules/admin/tournament/utils/const';
import { PlayerMailService } from 'src/modules/common/mail/services/player.mail.service';
import { ClothesService, CreatePlayerDto } from './dto/player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<Player>,
    private readonly playerMailService: PlayerMailService,
  ) {}

  async store(body: CreatePlayerDto): Promise<PlayerDocument> {
    let playerCode = 0;
    let checkPlayerCode = null;

    do {
      playerCode = Math.floor(1000 + Math.random() * 9000);

      checkPlayerCode = await this.playerModel
        .findOne({
          code: playerCode,
        })
        .exec();
    } while (checkPlayerCode);

    const createdData = {
      ...body,
      code: playerCode,
      status: PlayerStatus.Pending,
      services: {
        ...body.services,
        base: { value: true, price: ServicePrice.base },
        lunch: { value: body.services.lunch, price: ServicePrice.lunch },
        bus: { value: body.services.bus, price: ServicePrice.bus },
        disc: { quantity: body.services.disc, price: ServicePrice.disc },
        jerseys: this.calculateClothes(body.services.jerseys),
        shorts: this.calculateClothes(body.services.shorts),
      },
    };

    const player = await this.playerModel.create(createdData);

    await this.playerMailService.sendRegisterEmail(player);

    return player;
  }

  calculateClothes(data: ClothesService[]) {
    const clothes: any = {};

    data.map((item: ClothesService) => {
      const jerseyKey = `${item.color}-${item.size}`;

      if (clothes.hasOwnProperty(jerseyKey)) {
        clothes[jerseyKey] = {
          color: item.color,
          size: item.size,
          quantity: item.quantity + clothes[jerseyKey]['quantity'],
        };
      } else {
        clothes[jerseyKey] = {
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        };
      }
    });

    return Object.values(clothes);
  }
}

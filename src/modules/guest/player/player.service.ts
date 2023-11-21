import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClothesDetailFee } from 'src/modules/admin/player/entity/player.fee.entity';
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
        lunch: {
          value: body.services.lunch ?? false,
          price: ServicePrice.lunch,
        },
        bus: { value: body.services.bus ?? false, price: ServicePrice.bus },
        disc: { quantity: body.services.disc, price: ServicePrice.disc },
        jerseys: this.calculateClothes(
          body.services.jerseys,
          ServicePrice.jerseys,
        ),
        shorts: this.calculateClothes(body.services.shorts, ServicePrice.short),
      },
    };

    const player = await this.playerModel.create(createdData);

    await this.playerMailService.sendRegisterEmail(player);

    return player;
  }

  calculateClothes(data: ClothesService[], price: number): ClothesDetailFee[] {
    let clothes: ClothesDetailFee[] = [];

    data.map((item: ClothesService) => {
      const checkClothes = clothes.filter(
        (checkItem) =>
          checkItem.size === item.size && checkItem.color === item.color,
      ).length;

      if (checkClothes) {
        clothes = clothes.map((clothesItem) => {
          if (
            clothesItem.size === item.size &&
            clothesItem.color === item.color
          ) {
            return {
              color: clothesItem.color,
              size: clothesItem.size,
              quantity: item.quantity + clothesItem.quantity,
              price,
            };
          }

          return clothesItem;
        });
      } else {
        clothes.push({
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price,
        });
      }
    });

    return clothes;
  }
}

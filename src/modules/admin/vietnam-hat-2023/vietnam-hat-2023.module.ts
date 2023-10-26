import { Module } from '@nestjs/common';
import { VietnamHat2023Controller } from './vietnam-hat-2023.controller';
import { VietnamHat2023Service } from './vietnam-hat-2023.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TournamentPlayer,
  TournamentPlayerSchema,
} from '../../../schemas/tournament-player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TournamentPlayer.name,
        schema: TournamentPlayerSchema,
      },
    ]),
  ],
  controllers: [VietnamHat2023Controller],
  providers: [VietnamHat2023Service],
})
export class VietnamHat2023Module {}

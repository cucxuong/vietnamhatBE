import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'src/modules/common/config/config.module';
import {
    TournamentPlayer,
    TournamentPlayerSchema,
} from '../../../schemas/tournament-player.schema';
import { TournamentPlayersModule } from '../../guest/tournament_players/tournament-players.module';
import { TournamentsModule } from '../../guest/tournaments/tournaments.module';
import { VietnamHat2023Controller } from './vietnam-hat-2023.controller';
import { VietnamHat2023Service } from './vietnam-hat-2023.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TournamentPlayer.name,
        schema: TournamentPlayerSchema,
      },
    ]),
    TournamentsModule,
    TournamentPlayersModule,
    ConfigModule,
  ],
  controllers: [VietnamHat2023Controller],
  providers: [VietnamHat2023Service],
})
export class VietnamHat2023Module {}

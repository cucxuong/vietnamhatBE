import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TournamentPlayer,
  TournamentPlayerSchema,
} from 'src/schemas/tournament-player.schema';
import { Tournament, TournamentSchema } from 'src/schemas/tournament.schema';
import { TournamentPlayerController } from './tournament-players.controller';
import { TournamentPlayerService } from './tournament-players.service';
import { TournamentsModule } from "../tournaments/tournaments.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TournamentPlayer.name,
        schema: TournamentPlayerSchema,
      },
      {
        name: Tournament.name,
        schema: TournamentSchema,
      },
    ]),
    TournamentsModule,
  ],
  controllers: [TournamentPlayerController],
  providers: [TournamentPlayerService],
  exports: [TournamentPlayerService],
})
export class TournamentPlayersModule {}

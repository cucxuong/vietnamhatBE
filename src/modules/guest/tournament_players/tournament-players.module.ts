import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TournamentPlayer,
  TournamentPlayerSchema,
} from 'src/schemas/tournament-player.schema';
import { Tournament, TournamentSchema } from 'src/schemas/tournament.schema';
import { TournamentPlayerController } from './tournament-players.controller';
import { TournamentPlayerService } from './tournament-players.service';

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
  ],
  controllers: [TournamentPlayerController],
  providers: [TournamentPlayerService],
})
export class TournamentPlayersModule {}

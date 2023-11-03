import { Module } from '@nestjs/common';
import { TournamentController } from './tournaments.controller';
import { TournamentService } from './tournaments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament, TournamentSchema } from 'src/schemas/tournament.schema';
import { TournamentPlayer, TournamentPlayerSchema } from "../../../schemas/tournament-player.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tournament.name,
        schema: TournamentSchema,
      },
      {
        name: TournamentPlayer.name,
        schema: TournamentPlayerSchema,
      }
    ]),
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentsModule {
}

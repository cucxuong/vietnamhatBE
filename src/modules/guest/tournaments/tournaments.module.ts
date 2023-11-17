import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tournament,
  TournamentSchema,
} from 'src/modules/admin/tournament/schema/tournament.schema';
import {
  TournamentPlayer,
  TournamentPlayerSchema,
} from 'src/schemas/tournament-player.schema';
import { TournamentController } from './tournaments.controller';
import { TournamentService } from './tournaments.service';

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
      },
    ]),
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentsModule {}

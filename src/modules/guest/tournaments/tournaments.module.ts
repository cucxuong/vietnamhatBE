import { Module } from '@nestjs/common';
import { TournamentController } from './tournaments.controller';
import { TournamentService } from './tournaments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament, TournamentSchema } from 'src/schemas/tournament.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tournament.name,
        schema: TournamentSchema,
      },
    ]),
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentsModule {}

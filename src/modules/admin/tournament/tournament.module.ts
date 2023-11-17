import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament, TournamentSchema } from 'src/schemas/tournament.schema';
import { TournamentsController } from './tournament.controller';
import { TournamentsService } from './tournament.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tournament.name,
        schema: TournamentSchema,
      },
    ]),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentModule {}

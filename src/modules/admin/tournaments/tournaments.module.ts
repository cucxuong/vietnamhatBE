import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'src/modules/common/config/config.module';
import { Tournament, TournamentSchema } from 'src/schemas/tournament.schema';
import {
  TournamentStage,
  TournamentStageSchema,
} from './schema/tournament.stage.schema';
import { TournamentStageController } from './tournament.stage.controller';
import { TournamentStageService } from './tournament.stage.service';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Tournament.name,
        schema: TournamentSchema,
      },
      {
        name: TournamentStage.name,
        schema: TournamentStageSchema,
      },
    ]),
  ],
  controllers: [TournamentsController, TournamentStageController],
  providers: [TournamentsService, TournamentStageService],
})
export class TournamentsModule {}

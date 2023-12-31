import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import {
  TournamentPlayer,
  TournamentPlayerSchema,
} from '../../schemas/tournament-player.schema';
import { ConfigModule } from '../common/config/config.module';
import { TournamentPlayersModule } from '../guest/tournament_players/tournament-players.module';
import { TournamentsModule } from '../guest/tournaments/tournaments.module';
import { TournamentPlayerTask } from './tournament-player.task';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TournamentsModule,
    TournamentPlayersModule,
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: TournamentPlayer.name,
        schema: TournamentPlayerSchema,
      },
    ]),
  ],
  providers: [TournamentPlayerTask],
})
export class SchedulerModule {}

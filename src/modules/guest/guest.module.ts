import { Module } from '@nestjs/common';
import { TournamentPlayersModule } from './tournament_players/tournament-players.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, TournamentsModule, TournamentPlayersModule],
  controllers: [],
  providers: [],
})
export class GuestModule {}

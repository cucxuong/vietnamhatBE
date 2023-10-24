import { Module } from '@nestjs/common';
import { TournamentPlayersModule } from './tournament_players/tournament-players.module';
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [TournamentsModule, TournamentPlayersModule],
  providers: [],
})
export class GuestModule {}

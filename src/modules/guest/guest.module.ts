import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh_token/refresh.token.module';
import { TournamentPlayersModule } from './tournament_players/tournament-players.module';
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [
    AuthModule,
    RefreshTokenModule,
    TournamentsModule,
    TournamentPlayersModule,
  ],
  providers: [],
})
export class GuestModule {}

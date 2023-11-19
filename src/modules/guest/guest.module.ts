import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { TournamentModule } from './tournament/tournament.module';

@Module({
  imports: [AuthModule, PlayerModule, TournamentModule],
  controllers: [],
  providers: [],
})
export class GuestModule {}

import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { GroupModule } from './group/group.module';
import { MatchModule } from './match/match.module';
import { TeamModule } from './team/team.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { VietnamHat2023Module } from './vietnam-hat-2023/vietnam-hat-2023.module';

@Module({
  imports: [
    GroupModule,
    MatchModule,
    TeamModule,
    TournamentsModule,
    VietnamHat2023Module,
    RouterModule.register([
      {
        path: '/admin',
        module: GroupModule,
      },
      {
        path: '/admin',
        module: MatchModule,
      },
      {
        path: '/admin',
        module: TeamModule,
      },
      {
        path: '/admin',
        module: TournamentsModule,
      },
      {
        path: '/admin',
        module: VietnamHat2023Module,
      },
    ]),
  ],
  providers: [],
})
export class AdminModule {}

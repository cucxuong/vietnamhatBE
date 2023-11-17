import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TournamentModule } from './tournament/tournament.module';
import { VietnamHat2023Module } from './vietnam-hat-2023/vietnam-hat-2023.module';

@Module({
  imports: [
    TournamentModule,
    VietnamHat2023Module,
    RouterModule.register([
      {
        path: 'admin',
        module: TournamentModule,
      },
      {
        path: 'admin',
        module: VietnamHat2023Module,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}

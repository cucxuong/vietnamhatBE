import { Module } from '@nestjs/common';
import { TournamentsModule } from './tournaments/tournaments.module';
import { VietnamHat2023Module } from './vietnam-hat-2023/vietnam-hat-2023.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    TournamentsModule,
    VietnamHat2023Module,
    RouterModule.register([
      {
        path: 'admin',
        module: TournamentsModule,
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

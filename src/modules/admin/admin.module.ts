import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CountryModule } from './country/country.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    CountryModule,
    PlayerModule,
    // VietnamHat2023Module,,

    RouterModule.register([
      { path: 'admin', module: CountryModule },
      { path: 'admin', module: PlayerModule },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}

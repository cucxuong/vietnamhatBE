import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    PlayerModule,
    // VietnamHat2023Module,,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}

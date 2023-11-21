import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Player, PlayerSchema } from '../admin/player/schema/player.schema';
import { ConfigModule } from '../common/config/config.module';
import { PlayerTaskService } from './player.task';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Player.name,
        schema: PlayerSchema,
      },
    ]),
  ],
  providers: [PlayerTaskService],
})
export class SchedulerModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    TournamentPlayer,
    TournamentPlayerSchema,
} from 'src/schemas/tournament-player.schema';
import { BasicCommand } from './send.guilde.mail';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TournamentPlayer.name, schema: TournamentPlayerSchema },
    ]),
  ],
  providers: [BasicCommand],
})
export class CommandModule {}
